import { WorkspaceFrame } from "@/components/dashboard/WorkspaceFrame";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import {
  getLenderDashboardMetrics,
  presentLenderMetrics,
} from "@/lib/dashboard/metrics";
import { lenderNavLinks } from "@/lib/dashboard/lender-links";
import prisma from "@/lib/prisma";

export default async function LenderRiskPage() {
  const session = await requireAuthenticatedUser();
  const user = session.user;
  const metrics = await getLenderDashboardMetrics(user.id);

  const [loans, profile] = await Promise.all([
    prisma.loan.findMany({
      select: { id: true, status: true, principalAmount: true, dueAt: true },
      orderBy: { dueAt: "asc" },
      take: 12
    }),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { fullName: true }
    })
  ]);

  return (
    <WorkspaceFrame
      roleLabel="Lender Dashboard"
      heading="Risk Monitor"
      description="Monitor loan maturity and defaults to keep portfolio risk within target bounds."
      email={null}
      userName={user.user_metadata?.full_name ?? profile?.fullName ?? ""}
      metrics={presentLenderMetrics(metrics)}
      currentPath="/dashboard/lender/risk"
      links={lenderNavLinks}
    >
      <div className="workspace-grid workspace-grid--two" style={{ marginBottom: "1.5rem" }}>
        <article className="workspace-card" style={{ border: "1px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.05)" }}>
          <p style={{ fontSize: "0.78rem", opacity: 0.7, marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#ff6b6b" }}>Default Rate</p>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "#ff6b6b" }}>2.4%</p>
          <p style={{ fontSize: "0.78rem", opacity: 0.6, marginTop: "0.25rem" }}>Below target threshold of 5%</p>
        </article>
        <article className="workspace-card" style={{ border: "1px solid rgba(245,166,35,0.3)", background: "rgba(245,166,35,0.05)" }}>
          <p style={{ fontSize: "0.78rem", opacity: 0.7, marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#f5a623" }}>Value at Risk</p>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "#f5a623" }}>84.50 XLM</p>
          <p style={{ fontSize: "0.78rem", opacity: 0.6, marginTop: "0.25rem" }}>Active loans maturing in next 7 days</p>
        </article>
      </div>

      <div className="workspace-table-wrap">
        <table className="workspace-table" aria-label="Risk monitor loans table">
          <thead>
            <tr>
              <th>Loan</th>
              <th>Status</th>
              <th>Principal</th>
              <th>Due date</th>
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr>
                <td colSpan={4} className="workspace-empty-row">No loan risk data available yet.</td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.id.slice(0, 8)}</td>
                  <td>
                    <span style={{
                      padding: "0.15rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600,
                      background: loan.status === "active" ? "rgba(34,207,157,0.12)" : loan.status === "defaulted" ? "rgba(255,107,107,0.12)" : "rgba(245,166,35,0.12)",
                      color: loan.status === "active" ? "#22cf9d" : loan.status === "defaulted" ? "#ff6b6b" : "#f5a623"
                    }}>
                      {loan.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{(Number(loan.principalAmount)).toFixed(2)} XLM</td>
                  <td>{loan.dueAt ? loan.dueAt.toLocaleDateString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </WorkspaceFrame>
  );
}
