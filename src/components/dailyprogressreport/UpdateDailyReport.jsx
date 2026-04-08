import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const VITE_IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;
export default function UpdateDailyReport({ fetchReport , setReloadAfterUpdate}) {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const [formData, setFormData] = useState({
    employer: "",
    contractor: "",
    project_name: "",
    project_id: "",
    consultant: "",
    report_no: "",
    month: "",
    week_no: "",
    elapsed_date: "",
    remaining_days: "",
    commencement_date: "",
    duration: "",
    completion_date: "",
    forcast_completion_date: "",
    eot_granted: "",
    anticipated_eot: "",
    contract_value: "",
    confirmed_variations: "",
    revised_control_value: "",
    cumullative_percentage_certified: "",
    certified_to_date: "",
    cost_of_changes: "",
    overall_schedule_performance_percentage: "",
    overall_actual_performance_percentage: "",
    overall_progress_daysAheadDelay: "",

    baseline: [
      {
        recovery_programe_comparison: "",
        submission_date: "",
        Approval_date: "",
        planned: "",
        actual: "",
        days_ahead_delay: "",
      },
    ],

    progressSCurve: [{ month: "", planned: "", actual: "" }],

    engineeringQuantity: [
      {
        kpi_name: "",
        category: "",
        responsibility: "",
        planned_to_date: "",
        released_to_date: "",
        performance_percentage_actual_planned: "",
        status: [{ status_name: "", status_value: "" }],
      },
    ],

    overallProgress: [
      {
        progress_name: "",
        progress_planned_thisWeek: "",
        progress_actual_thisWeek: "",
        progress_planned_lastWeek: "",
        progress_actual_lastWeek: "",
      },
    ],

    topIssues: [
      {
        issue: "",
        originator: "",
        category: "",
        recommended_action: "",
        actionBy: "",
      },
    ],

    manPowerHistogram: [
      { manpower_month: "", manpower_actual: "", manpower_planned: "" },
    ],

    mainRisks: [
      {
        risk_description: "",
        risk_category: "",
        risk_impact: "",
        risk_response: "",
      },
    ],

    progressPhotos: [{ img_name: "", img_path: "" }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getReportDataByProjectId = async () => {
    try {
      const res = await fetch(`${API_URL}/dailyprogress/${params.id}`, {
        method: "GET",
      });
      const data = await res.json();
      const report = Array.isArray(data.data) ? data.data[0] : data.data;
      if (report) {
        setFormData((prev) => ({
          ...prev,
          ...report,
        }));
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };
  useEffect(() => {
    getReportDataByProjectId();
  }, []);
  const handleSubmit = async () => {
    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "progressPhotos") {
        const value = formData[key];
        if (typeof value === "object") {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, value);
        }
      }
    });
    formData.progressPhotos.forEach((photo) => {
      if (photo.img_path instanceof File) {
        form.append("progressPhotos", photo.img_path);
        form.append("progressPhotos", photo.img_name);
      } else {
        // existing image keep
        form.append(
          "existingPhotos",
          JSON.stringify({
            img_name: photo.img_name,
            img_path: photo.img_path,
          }),
        );
      }
    });

    const res = await fetch(
      `${API_URL}/dailyprogress/${formData._id || params.id}`,
      {
        method: "PUT",
        body: form,
      },
    );

    const data = await res.json();

    alert("Report updated successfully!");
    setOpen(false);
    setReloadAfterUpdate(prev=>!prev);
     getReportDataByProjectId();
    if (fetchReport) fetchReport();
  };

  // reusable array renderer
  const renderArrayInput = (arrayName, fields) => {
    return formData[arrayName].map((item, i) => (
      <div
        key={i}
        className="grid grid-cols-4 gap-2 mb-2 border p-2 relative rounded"
      >
        {fields.map((field) => (
          <div key={field} className="flex flex-col mb-2">
            <label className="mb-1 font-semibold text-sm capitalize">
              {field.replace(/_/g, " ")}
            </label>

            {arrayName === "progressPhotos" && field === "img_path" ? (
              <div>
                {/* show old or new image */}
                {item.img_path && (
                  <img
                    src={
                      item.img_path instanceof File
                        ? URL.createObjectURL(item.img_path)
                        : `${VITE_IMAGE_PATH}${item.img_path}`
                    }
                    alt=""
                    className="w-32 h-20 object-cover border mb-2"
                  />
                )}

                {/* choose new image */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const x = [...formData[arrayName]];
                    x[i][field] = e.target.files[0];
                    setFormData({ ...formData, [arrayName]: x });
                  }}
                  className="border p-2 rounded-md"
                />

               
              </div>
            ) : (
              <input
                placeholder={field}
                value={item[field]}
                onChange={(e) => {
                  const x = [...formData[arrayName]];
                  x[i][field] = e.target.value;
                  setFormData({ ...formData, [arrayName]: x });
                }}
                className="border p-2 rounded-md"
              />
            )}
          </div>
        ))}

        <button
          onClick={() => {
            const x = formData[arrayName].filter((_, index) => index !== i);
            setFormData({ ...formData, [arrayName]: x });
          }}
          className="bg-red-500 text-white absolute top-1 right-1 p-1 rounded-full"
        >
          <CgClose />
        </button>
      </div>
    ));
  };

  const addRow = (arrayName, template) => {
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], template],
    });
  };
  return (
    <>
      <div className="w-full ml-auto flex justify-end mb-4">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded"
        >
          Update Report
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-[95%] h-[95vh] overflow-y-auto p-6 rounded">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Update Report</h2>
              <button
                className="bg-primary p-1 rounded-full px-[6px] cursor-pointer text-white"
                onClick={() => setOpen(false)}
              >
                <CgClose />
              </button>
            </div>
            {/* BASIC INFO */}
            <div className="grid grid-cols-4 gap-2">
              {[
                // "employer",
                // "contractor",
                // "project_name",
                // "project_id",
                // "consultant",
                // "report_no",
                // "month",
                // "week_no",
                // "elapsed_date",
                // "remaining_days",
                "commencement_date",
                //"duration",
                "completion_date",
                //"forcast_completion_date",
                "eot_granted",
                "anticipated_eot",
                "contract_value",
                "confirmed_variations",
                "revised_control_value",
                "cumullative_percentage_certified",
                "certified_to_date",
                "cost_of_changes",
                "overall_schedule_performance_percentage",
                "overall_actual_performance_percentage",
                "overall_progress_daysAheadDelay",
              ].map((field) => (
                <div key={field} className="flex flex-col mb-2">
                  <label
                    className="mb-1 font-semibold text-sm capitalize"
                    htmlFor={field}
                  >
                    {field.replace(/_/g, " ")}
                  </label>
                  {field === "commencement_date" || field === "completion_date" ? (
                    <input
                      type="date"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="border p-2 rounded-md"
                    />
                  ) : (
                    <input
                      name={field}
                      placeholder={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="border p-2 rounded-md"
                    />
                  )}
                </div>
              ))}
            </div>
            {/* BASELINE */}
            <h2 className="font-bold mt-6">Baseline</h2>
            {renderArrayInput("baseline", [
              "recovery_programe_comparison",
              "submission_date",
              "Approval_date",
              "planned",
              "actual",
              "days_ahead_delay",
            ])}
            <button
              onClick={() =>
                addRow("baseline", {
                  recovery_programe_comparison: "",
                  submission_date: "",
                  Approval_date: "",
                  planned: "",
                  actual: "",
                  days_ahead_delay: "",
                })
              }
              className="bg-green-600 text-white px-3 py-1"
            >
              + Add Baseline
            </button>
            {/* Progress S Curve */}
            <h2 className="font-bold mt-6">Progress S Curve</h2>{" "}
            {renderArrayInput("progressSCurve", ["month", "planned", "actual"])}{" "}
            <button
              onClick={() =>
                addRow("progressSCurve", { month: "", planned: "", actual: "" })
              }
              className="bg-green-600 text-white px-3 py-1"
            >
              {" "}
              + Add Row{" "}
            </button>
            {/* ENGINEERING QUANTITY */}
            <h2 className="font-bold mt-6">Engineering Quantity</h2>
            {formData.engineeringQuantity.map((item, i) => (
              <div key={i} className="border p-3 mb-3 rounded relative">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="font-medium text-sm">
                      KPI Name
                    </label>
                    <input
                      placeholder="KPI Name"
                      value={item.kpi_name}
                      onChange={(e) => {
                        const x = [...formData.engineeringQuantity];
                        x[i].kpi_name = e.target.value;
                        setFormData({ ...formData, engineeringQuantity: x });
                      }}
                      className="border p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="font-medium text-sm">
                      Category
                    </label>
                    <input
                      placeholder="Category"
                      value={item.category}
                      onChange={(e) => {
                        const x = [...formData.engineeringQuantity];
                        x[i].category = e.target.value;
                        setFormData({ ...formData, engineeringQuantity: x });
                      }}
                      className="border p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="font-medium text-sm">
                      Responsibility
                    </label>
                    <input
                      placeholder="Responsibility"
                      value={item.responsibility}
                      onChange={(e) => {
                        const x = [...formData.engineeringQuantity];
                        x[i].responsibility = e.target.value;
                        setFormData({ ...formData, engineeringQuantity: x });
                      }}
                      className="border p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="font-medium text-sm">
                      Planned To Date
                    </label>
                    <input
                      placeholder="Planned To Date"
                      value={item.planned_to_date}
                      onChange={(e) => {
                        const x = [...formData.engineeringQuantity];
                        x[i].planned_to_date = e.target.value;
                        setFormData({ ...formData, engineeringQuantity: x });
                      }}
                      className="border p-2 rounded-md"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="font-medium text-sm">
                      Released To Date
                    </label>
                    <input
                      placeholder="Released To Date"
                      value={item.released_to_date}
                      onChange={(e) => {
                        const x = [...formData.engineeringQuantity];
                        x[i].released_to_date = e.target.value;
                        setFormData({ ...formData, engineeringQuantity: x });
                      }}
                      className="border p-2 rounded-md"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="font-medium text-sm">
                      Performance % (Actual/Planned)
                    </label>
                    <input
                      placeholder="Performance % (Actual/Planned)"
                      value={item.performance_percentage_actual_planned}
                      onChange={(e) => {
                        const x = [...formData.engineeringQuantity];
                        x[i].performance_percentage_actual_planned =
                          e.target.value;
                        setFormData({ ...formData, engineeringQuantity: x });
                      }}
                      className="border p-2 rounded-md"
                    />
                  </div>
                </div>

                {/* STATUS */}
                {item.status.map((s, j) => (
                  <div key={j} className="grid grid-cols-2 gap-2 mb-2 relative">
                    <input
                      placeholder="Status Name"
                      value={s.status_name}
                      onChange={(e) => {
                        const x = [...formData.engineeringQuantity];
                        x[i].status[j].status_name = e.target.value;
                        setFormData({
                          ...formData,
                          engineeringQuantity: x,
                        });
                      }}
                      className="border p-2"
                    />

                    <input
                      placeholder="Status Value"
                      value={s.status_value}
                      onChange={(e) => {
                        const x = [...formData.engineeringQuantity];
                        x[i].status[j].status_value = e.target.value;
                        setFormData({
                          ...formData,
                          engineeringQuantity: x,
                        });
                      }}
                      className="border p-2"
                    />

                    <button
                      onClick={() => {
                        const x = [...formData.engineeringQuantity];
                        x[i].status = x[i].status.filter((_, idx) => idx !== j);
                        setFormData({
                          ...formData,
                          engineeringQuantity: x,
                        });
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <CgClose />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const x = [...formData.engineeringQuantity];
                    x[i].status.push({
                      status_name: "",
                      status_value: "",
                    });
                    setFormData({
                      ...formData,
                      engineeringQuantity: x,
                    });
                  }}
                  className="bg-green-600 text-white px-2 py-1"
                >
                  + Add Status
                </button>

                <button
                  onClick={() => {
                    const x = formData.engineeringQuantity.filter(
                      (_, idx) => idx !== i,
                    );
                    setFormData({
                      ...formData,
                      engineeringQuantity: x,
                    });
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <CgClose />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setFormData({
                  ...formData,
                  engineeringQuantity: [
                    ...formData.engineeringQuantity,
                    {
                      kpi_name: "",
                      category: "",
                      responsibility: "",
                      status: [{ status_name: "", status_value: "" }],
                    },
                  ],
                })
              }
              className="bg-green-600 text-white px-3 py-1"
            >
              + Add Engineering
            </button>
            <h2 className="font-bold mt-6">Overall Progress</h2>{" "}
            {renderArrayInput("overallProgress", [
              "progress_name",
              "progress_planned_thisWeek",
              "progress_actual_thisWeek",
              "progress_planned_lastWeek",
              "progress_actual_lastWeek",
            ])}{" "}
            <button
              onClick={() =>
                addRow("overallProgress", {
                  progress_name: "",
                  progress_planned_thisWeek: "",
                  progress_actual_thisWeek: "",
                  progress_planned_lastWeek: "",
                  progress_actual_lastWeek: "",
                })
              }
              className="bg-green-600 text-white px-3 py-1"
            >
              {" "}
              + Add Progress{" "}
            </button>{" "}
            <h2 className="font-bold mt-6">Top Issues</h2>{" "}
            {renderArrayInput("topIssues", [
              "issue",
              "originator",
              "category",
              "recommended_action",
              "actionBy",
            ])}{" "}
            <button
              onClick={() =>
                addRow("topIssues", {
                  issue: "",
                  originator: "",
                  category: "",
                  recommended_action: "",
                  actionBy: "",
                })
              }
              className="bg-green-600 text-white px-3 py-1"
            >
              {" "}
              + Add Issue{" "}
            </button>{" "}
            <h2 className="font-bold mt-6">Man Power Histogram</h2>{" "}
            {renderArrayInput("manPowerHistogram", [
              "manpower_month",
              "manpower_actual",
              "manpower_planned",
            ])}{" "}
            <button
              onClick={() =>
                addRow("manPowerHistogram", {
                  manpower_month: "",
                  manpower_actual: "",
                  manpower_planned: "",
                })
              }
              className="bg-green-600 text-white px-3 py-1"
            >
              {" "}
              + Add Row{" "}
            </button>{" "}
            <h2 className="font-bold mt-6">Main Risks</h2>{" "}
            {renderArrayInput("mainRisks", [
              "risk_description",
              "risk_category",
              "risk_impact",
              "risk_response",
            ])}{" "}
            <button
              onClick={() =>
                addRow("mainRisks", {
                  risk_description: "",
                  risk_category: "",
                  risk_impact: "",
                  risk_response: "",
                })
              }
              className="bg-green-600 text-white px-3 py-1"
            >
              {" "}
              + Add Risk{" "}
            </button>{" "}
            <h2 className="font-bold mt-6">Progress Photos</h2>{" "}
            {renderArrayInput("progressPhotos", ["img_name", "img_path"])}{" "}
            <button
              onClick={() =>
                addRow("progressPhotos", { img_name: "", img_path: "" })
              }
              className="bg-green-600 text-white px-3 py-1"
            >
              {" "}
              + Add Photo{" "}
            </button>
            {/* SUBMIT */}
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded"
              >
                Update Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
