-- Capture l’adresse e-mail avec la réservation sans rendre obligatoire la migration
-- pour les réservations historiques déjà présentes.
ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS email text;

-- Les déclencheurs de réservation appellent net.http_post pour envoyer les messages
-- WhatsApp via UltraMsg. Sans pg_net installé, ils consignent une erreur de schéma.
CREATE EXTENSION IF NOT EXISTS pg_net;
