-- Supabase grants EXECUTE sur les nouvelles fonctions aux rôles anon/authenticated
-- par défaut. Retirer explicitement anon des opérations réservées aux admins.
revoke all on function public.update_reservation_status(uuid, text)
  from public, anon, authenticated;
grant execute on function public.update_reservation_status(uuid, text)
  to authenticated;

revoke all on function public.update_reservation_details(uuid, jsonb)
  from public, anon, authenticated;
grant execute on function public.update_reservation_details(uuid, jsonb)
  to authenticated;

revoke all on function public.delete_reservation(uuid)
  from public, anon, authenticated;
grant execute on function public.delete_reservation(uuid)
  to authenticated;
