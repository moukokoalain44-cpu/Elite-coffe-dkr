import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Megaphone, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/AdminChrome";
import {
  fetchCustomersAdmin,
  fetchCommunicationCampaigns,
  fetchCommunicationDeliveryLogs,
  saveCommunicationCampaign,
  sendUltramsgMessage,
  type CommunicationCampaign,
  type CommunicationDeliveryLog,
} from "@/lib/supabase";

export const Route = createFileRoute("/admin/communication")({ component: CommunicationPage });

const templates = {
  accueil: "Bonjour, merci de contacter Elite Coffee. Comment pouvons-nous vous aider ?",
  invitation: "Bonjour {{nom}}, découvrez les prochains rendez-vous gourmands d’Elite Coffee.",
  fidelite: "Bonjour {{nom}}, nous serions ravis de vous accueillir à nouveau chez Elite Coffee !",
  reservation:
    "Bonjour {{nom}}, nous pensons à vous chez Elite Coffee. Souhaitez-vous réserver une table cette semaine ?",
  evenement:
    "Bonjour {{nom}}, Elite Coffee vous invite à découvrir notre prochain événement gourmand. Répondez à ce message pour recevoir les détails.",
};

function CommunicationPage() {
  const [campaigns, setCampaigns] = useState<CommunicationCampaign[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<CommunicationDeliveryLog[]>([]);
  const [tab, setTab] = useState<"direct" | "campaigns">("direct");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(templates.accueil);
  const [sending, setSending] = useState(false);
  const [campaign, setCampaign] = useState({
    name: "",
    audience: "all",
    channel: "whatsapp",
    message: "",
  });

  const reload = () =>
    Promise.all([fetchCommunicationCampaigns(), fetchCommunicationDeliveryLogs()])
      .then(([nextCampaigns, nextLogs]) => {
        setCampaigns(nextCampaigns);
        setDeliveryLogs(nextLogs);
      })
      .catch(() => toast.error("Impossible de charger les campagnes."));

  useEffect(() => {
    void reload();
  }, []);

  const totalMessages = deliveryLogs.length;
  const deliveredMessages = deliveryLogs.filter((item) =>
    ["delivered", "read"].includes(item.status),
  ).length;
  const readMessages = deliveryLogs.filter((item) => item.status === "read").length;
  const failedMessages = deliveryLogs.filter((item) => item.status === "failed").length;
  const campaignStats = (campaignId: string) => {
    const rows = deliveryLogs.filter((item) => item.campaign_id === campaignId);
    const delivered = rows.filter((item) => ["delivered", "read"].includes(item.status)).length;
    return {
      total: rows.length,
      delivered,
    };
  };

  const sendWhatsApp = async () => {
    const clean = phone.replace(/\D/g, "");
    if (!clean || !message.trim()) {
      toast.error("Renseignez un téléphone et un message.");
      return;
    }
    setSending(true);
    try {
      await sendUltramsgMessage({ phone: clean, message });
      toast.success("Message envoyé dans la file UltraMsg");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "L’envoi UltraMsg a échoué.");
    } finally {
      setSending(false);
    }
  };

  const saveCampaign = async (status: "draft" | "scheduled") => {
    if (!campaign.name.trim() || !campaign.message.trim()) {
      toast.error("Renseignez le nom et le message de la campagne.");
      return;
    }
    try {
      await saveCommunicationCampaign({ ...campaign, status });
      toast.success(status === "scheduled" ? "Campagne planifiée" : "Brouillon enregistré");
      setCampaign({ name: "", audience: "all", channel: "whatsapp", message: "" });
      reload();
    } catch {
      toast.error("Impossible d’enregistrer la campagne.");
    }
  };

  const sendCampaign = async () => {
    if (!campaign.name.trim() || !campaign.message.trim()) {
      toast.error("Renseignez le nom et le message de la campagne.");
      return;
    }
    setSending(true);
    try {
      const customers = await fetchCustomersAdmin();
      const targets =
        campaign.audience === "recent"
          ? customers.slice(0, 50)
          : campaign.audience === "reservations"
            ? customers.filter((customer) => ["reservation", "buffet"].includes(customer.source))
            : customers;
      const saved = await saveCommunicationCampaign({
        ...campaign,
        status: "scheduled",
        total_recipients: targets.length,
      });
      const results = await Promise.allSettled(
        targets.map((customer) =>
          sendUltramsgMessage({
            phone: customer.phone,
            campaignId: saved.id,
            message: campaign.message.replaceAll("{{nom}}", customer.name),
          }),
        ),
      );
      const sent = results.filter((result) => result.status === "fulfilled").length;
      await saveCommunicationCampaign({
        ...campaign,
        id: saved.id,
        status: "sent",
        total_recipients: sent,
      });
      toast.success(`${sent} message(s) envoyé(s) dans la file UltraMsg`);
      setCampaign({ name: "", audience: "all", channel: "whatsapp", message: "" });
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "La campagne n’a pas pu être envoyée.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Communication relationnelle"
        title="Campagnes & messages personnalisés"
        description="Contactez directement vos clients et préparez vos campagnes. Les indicateurs affichés proviennent uniquement du journal Supabase et des accusés ACK UltraMsg reçus."
      />
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setTab("direct")}
          className={`rounded-xl px-4 py-2.5 text-sm font-bold ${tab === "direct" ? "bg-[#3a2d33] text-white" : "bg-white text-[#665b60]"}`}
        >
          Message personnalisé
        </button>
        <button
          onClick={() => setTab("campaigns")}
          className={`rounded-xl px-4 py-2.5 text-sm font-bold ${tab === "campaigns" ? "bg-[#3a2d33] text-white" : "bg-white text-[#665b60]"}`}
        >
          Campagnes
        </button>
      </div>
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Tentatives enregistrées", totalMessages, "journal Supabase"],
          ["Délivrés confirmés", deliveredMessages, "accusé UltraMsg reçu"],
          ["Lus confirmés", readMessages, "accusé de lecture reçu"],
          ["Échecs enregistrés", failedMessages, "erreur d’envoi journalisée"],
        ].map(([label, value, detail]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-[#eee8e8] bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#93878d]">{label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-[#3a2d33]">{value}</p>
            <p className="mt-1 text-xs text-[#93878d]">{detail}</p>
          </div>
        ))}
      </section>
      {tab === "direct" && (
        <AdminCard>
          <div className="flex items-center gap-3">
            <MessageCircle className="text-[#237747]" />
            <div>
              <h2 className="font-display text-2xl font-bold">Message personnalisé</h2>
              <p className="text-sm text-[#93878d]">
                Préparez un message ponctuel pour un client depuis son numéro de téléphone.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-bold">
              Téléphone client
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+221 77…"
                className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 font-normal outline-none focus:border-[#d85f82]"
              />
            </label>
            <label className="text-sm font-bold">
              Modèle
              <select
                onChange={(event) =>
                  setMessage(templates[event.target.value as keyof typeof templates])
                }
                className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 font-normal outline-none"
              >
                <option value="accueil">Modèle — accueil</option>
                <option value="invitation">Invitation</option>
                <option value="fidelite">Fidélité</option>
                <option value="reservation">Relance réservation</option>
                <option value="evenement">Invitation événement</option>
              </select>
            </label>
          </div>
          <label className="mt-4 block text-sm font-bold">
            Message
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              className="mt-2 w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 font-normal outline-none focus:border-[#d85f82]"
            />
          </label>
          <button
            onClick={() => void sendWhatsApp()}
            disabled={sending}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#237747] px-4 py-3 text-sm font-bold text-white"
          >
            <Send size={16} /> {sending ? "Envoi en cours…" : "Envoyer avec UltraMsg"}
          </button>
        </AdminCard>
      )}
      {tab === "campaigns" && (
        <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
          <AdminCard>
            <div className="flex items-center gap-3">
              <Megaphone className="text-[#a5365f]" />
              <h2 className="font-display text-2xl font-bold">Nouvelle campagne</h2>
            </div>
            <div className="mt-5 space-y-4">
              <input
                value={campaign.name}
                onChange={(event) => setCampaign({ ...campaign, name: event.target.value })}
                placeholder="Nom de campagne"
                className="w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 outline-none"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={campaign.audience}
                  onChange={(event) => setCampaign({ ...campaign, audience: event.target.value })}
                  className="rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3"
                >
                  <option value="all">Tous les clients</option>
                  <option value="recent">Clients récents</option>
                  <option value="reservations">Clients ayant réservé</option>
                </select>
                <select
                  value={campaign.channel}
                  onChange={(event) => setCampaign({ ...campaign, channel: event.target.value })}
                  className="rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3"
                >
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <textarea
                value={campaign.message}
                onChange={(event) => setCampaign({ ...campaign, message: event.target.value })}
                rows={6}
                placeholder="Message de campagne…"
                className="w-full rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 outline-none"
              />
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm font-bold">Modèle</label>
                <select
                  onChange={(event) =>
                    setCampaign({
                      ...campaign,
                      message: templates[event.target.value as keyof typeof templates],
                    })
                  }
                  className="rounded-xl border border-[#e7e2e5] bg-[#fdfbfc] px-3 py-3 text-sm"
                >
                  <option value="">Choisir un modèle à copier</option>
                  <option value="accueil">Accueil</option>
                  <option value="invitation">Invitation</option>
                  <option value="fidelite">Fidélité</option>
                  <option value="reservation">Relance réservation</option>
                  <option value="evenement">Invitation événement</option>
                </select>
                <span className="text-xs text-[#93878d]">
                  Le texte reste modifiable avant l’envoi.
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => void saveCampaign("draft")}
                  className="rounded-xl border border-[#e7e2e5] px-4 py-3 text-sm font-bold"
                >
                  Enregistrer brouillon
                </button>
                <button
                  onClick={() => void saveCampaign("scheduled")}
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3a2d33] px-4 py-3 text-sm font-bold text-white"
                >
                  <CalendarClock size={16} /> Planifier
                </button>
                <button
                  onClick={() => void sendCampaign()}
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#237747] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  <Send size={16} /> {sending ? "Envoi…" : "Envoyer la campagne"}
                </button>
              </div>
            </div>
          </AdminCard>
          <AdminCard>
            <h2 className="font-display text-2xl font-bold">Campagnes existantes</h2>
            <div className="mt-5 space-y-3">
              {campaigns.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#eee8e8] p-4">
                  <p className="font-bold">{item.name}</p>
                  <p className="mt-1 text-xs text-[#93878d]">
                    {item.channel} · {item.audience} · {item.status}
                  </p>
                  {(() => {
                    const stats = campaignStats(item.id);
                    return stats.total ? (
                      <p className="mt-2 text-xs font-semibold text-[#237747]">
                        {stats.delivered} délivré(s) confirmé(s) sur {stats.total} tentative(s)
                        journalisée(s)
                      </p>
                    ) : null;
                  })()}
                </div>
              ))}
              {!campaigns.length && (
                <p className="text-sm text-[#93878d]">Aucune campagne enregistrée.</p>
              )}
            </div>
          </AdminCard>
        </div>
      )}
    </>
  );
}
