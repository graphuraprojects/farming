import React from "react";

const FarmerDashboard = () => {
  return (
    <div className="min-h-screen bg-background-dark dark:bg-background-dark p-6 lg:p-10 font-display text-[#1f3d2b]">
      <div className="mx-auto max-w-[1200px] flex flex-col gap-8">
        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(31,61,43,0.05)] transition-all hover:shadow-lg dark:border-gray-800 dark:bg-surface-dark">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-50 group-hover:scale-110"></div>

            <div className="relative z-10 flex flex-col gap-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#E8F5E9]">
                <span className="material-symbols-outlined">agriculture</span>
              </div>

              <p className="text-sm text-gray-500">Upcoming Rentals</p>

              <div className="flex flex-col">
                <h3 className="text-3xl font-bold text-primary">2 Scheduled</h3>

                <p className="text-xs text-gray-400">
                  Next: Oct 12 - John Deere S700
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(31,61,43,0.05)] transition-all hover:shadow-lg dark:border-gray-800 dark:bg-surface-dark">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-50 group-hover:scale-110"></div>

            <div className="relative z-10 flex flex-col gap-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#FFF8F1] text-indigo-600">
                <span className="material-symbols-outlined">attach_money</span>
              </div>

              <p className="text-sm text-gray-500">Upcoming Rentals</p>

              <div className="flex flex-col">
                <h3 className="text-3xl font-bold text-primary">2 Scheduled</h3>

                <p className="text-xs text-gray-400">
                  Next: Oct 12 - John Deere S700
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(31,61,43,0.05)] transition-all hover:shadow-lg dark:border-gray-800 dark:bg-surface-dark">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-50 group-hover:scale-110"></div>

            <div className="relative z-10 flex flex-col gap-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#EEF2FF] text-indigo-600">
                <span className="material-symbols-outlined">
                  event_upcoming
                </span>
              </div>

              <p className="text-sm text-gray-500">Upcoming Rentals</p>

              <div className="flex flex-col">
                <h3 className="text-3xl font-bold text-primary">2 Scheduled</h3>

                <p className="text-xs text-gray-400">
                  Next: Oct 12 - John Deere S700
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section className="flex flex-col gap-4 rounded-xl bg-white shadow-sm dark:border-gray-800 dark:bg-surface-dark">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <h3 className="text-lg font-bold text-primary">
              Recent Rental Activity
            </h3>

            <button className="text-sm font-medium text-primary hover:underline">
              View All
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                  <th className="px-6 py-4">Machinery</th>
                  <th className="px-6 py-4">Rental Dates</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Cost</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Invoice</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {/* Row 1 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg bg-cover bg-center"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDKjsBlPUa-1WMANyzDiOH9c5nUWDp-la0PfC9Xv2UfekNd3Dlf67o1Mp3yhwnvCRgeRA_k3Rqtbsv8Gues1vFRgFKgwxKfwBQeviz7lC7x--NNvKaZ7c3EBynmRPzV3id9KX4Z0wCGpp1ZpXZi8wz61nGR8WvZcLSucqi9Jka5ydpTC83hW2Ursy0IBGoDzSOkeaxmfXBdfBEneQksVLrfCS8i1MtFDjq_ZS4eH9h2XYm6lJX37Oj5xF5G2Yssj-wO89-wtOEv_Rsu')",
                        }}
                      ></div>

                      <div>
                        <p className="text-sm font-bold text-primary">
                          John Deere 8R
                        </p>
                        <p className="text-xs text-gray-500">Heavy Duty</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">Oct 01 - Oct 05, 2023</td>
                  <td className="px-6 py-4">5 Days</td>
                  <td className="px-6 py-4 font-semibold">$2,250</td>

                  <td className="px-6 py-4">
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                      In Progress
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="text-secondary font-semibold">
                      Download
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FarmerDashboard;
