import { getUserSettings } from "@/actions/settings";
import SettingsForm from "@/components/dashboard/SettingsForm";

export const metadata = { title: "Settings — GrowthOS" };

export default async function SettingsPage() {
  const user = await getUserSettings();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-muted mt-1">Manage your account preferences.</p>
      </div>

      {/* Currency */}
      <section className="card mb-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-primary">Currency</h2>
          <p className="text-sm text-muted mt-0.5">
            Choose the currency used to display all amounts across your dashboard.
          </p>
        </div>
        <SettingsForm currentCurrency={user.currency ?? "USD"} />
      </section>
    </div>
  );
}
