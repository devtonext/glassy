import { PageHeader } from "@/components/admin/PageHeader";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { cardClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";

export default async function AccountPage() {
  const { user } = await requireAdmin();

  return (
    <>
      <PageHeader title="Account" description={`Signed in as ${user.email}`} />
      <section className={`${cardClass} max-w-lg p-6`}>
        <h2 className="font-semibold text-ink">Change password</h2>
        <PasswordForm />
      </section>
    </>
  );
}
