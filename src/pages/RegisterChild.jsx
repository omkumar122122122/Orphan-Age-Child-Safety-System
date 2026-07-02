import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FiCalendar, FiCamera, FiCheckCircle, FiFileText, FiMapPin, FiSave, FiUser } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import Card from "../components/Card";
import FormInput from "../components/FormInput";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { orphanages } from "../data/dummyData";
import { roleLabels } from "../utils/constants";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const foundConditions = ["Found alone", "Rescued by police", "Referred by hospital", "Transferred from agency", "Surrendered safely"];

export default function RegisterChild() {
  const { user } = useAuth();
  const [photoPreview, setPhotoPreview] = useState("");
  const [savedRecord, setSavedRecord] = useState(null);
  const { register, handleSubmit, reset, formState, watch } = useForm({
    defaultValues: {
      orphanage: user.role === "orphanage" ? user.department : orphanages[0].name,
      risk: "Low",
      foundCondition: foundConditions[0]
    }
  });

  const selectedPhoto = watch("photo");
  const photoName = selectedPhoto?.[0]?.name;

  const recordId = useMemo(() => `CH-${Math.floor(1000 + Math.random() * 9000)}`, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreview("");
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
  };

  const onSubmit = (values) => {
    const record = {
      id: recordId,
      ...values,
      photoName: values.photo?.[0]?.name || "No photo uploaded",
      registeredBy: user.name,
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem("registered_children") || "[]");
    localStorage.setItem("registered_children", JSON.stringify([record, ...existing]));
    setSavedRecord(record);
    reset({
      orphanage: user.role === "orphanage" ? user.department : orphanages[0].name,
      risk: "Low",
      foundCondition: foundConditions[0]
    });
    setPhotoPreview("");
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[roleLabels[user.role], "Register Child"]} />
      <Card>
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-civic-600 dark:text-civic-100">New Child Intake</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-950 dark:text-white">Register a Child</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Capture identity, admission, rescue, health, and safety details for the child welfare record.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Draft Child ID</p>
            <p className="mt-1 text-lg font-extrabold text-slate-950 dark:text-white">{recordId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <section className="grid gap-6 xl:grid-cols-[260px_1fr]">
            <div>
              <h2 className="text-base font-bold text-slate-950 dark:text-white">Photo</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Upload a clear recent photo for identification.</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
                {photoPreview ? (
                  <img src={photoPreview} alt="Child preview" className="h-full w-full object-cover" />
                ) : (
                  <FiCamera className="h-10 w-10 text-slate-400" />
                )}
              </div>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Child Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-civic-600 file:px-4 file:py-2 file:font-semibold file:text-white dark:text-slate-300"
                  {...register("photo", { required: "Photo is required", onChange: handlePhotoChange })}
                />
                <span className="mt-2 block text-xs text-slate-500">{photoName || "PNG or JPG image"}</span>
                {formState.errors.photo && <span className="mt-1 block text-xs font-semibold text-red-600">{formState.errors.photo.message}</span>}
              </label>
            </div>
          </section>

          <Section title="Identity Details" description="Basic details used across child welfare records.">
            <FormInput label="Full Name" icon={FiUser} placeholder="Enter child name" error={formState.errors.name?.message} {...register("name", { required: "Name is required" })} />
            <FormInput
              label="Age"
              icon={FiUser}
              type="number"
              min="0"
              max="18"
              placeholder="Age"
              error={formState.errors.age?.message}
              {...register("age", { required: "Age is required", min: { value: 0, message: "Age cannot be negative" }, max: { value: 18, message: "Age must be 18 or below" } })}
            />
            <Select label="Gender" error={formState.errors.gender?.message} {...register("gender", { required: "Gender is required" })}>
              <option value="">Select gender</option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </Select>
            <Select label="Blood Group" error={formState.errors.bloodGroup?.message} {...register("bloodGroup", { required: "Blood group is required" })}>
              <option value="">Select blood group</option>
              {bloodGroups.map((group) => (
                <option key={group}>{group}</option>
              ))}
            </Select>
          </Section>

          <Section title="Admission Details" description="Record how the child entered care and where the child is assigned.">
            <FormInput
              label="Date of Admission"
              icon={FiCalendar}
              type="date"
              error={formState.errors.admissionDate?.message}
              {...register("admissionDate", { required: "Admission date is required" })}
            />
            <Select label="Assigned Orphanage" disabled={user.role === "orphanage"} {...register("orphanage", { required: "Orphanage is required" })}>
              {orphanages.map((home) => (
                <option key={home.id}>{home.name}</option>
              ))}
            </Select>
            <Select label="How the Child Was Found" {...register("foundCondition", { required: "Found condition is required" })}>
              {foundConditions.map((condition) => (
                <option key={condition}>{condition}</option>
              ))}
            </Select>
            <FormInput label="Found Location" icon={FiMapPin} placeholder="Area, city, police station" error={formState.errors.foundLocation?.message} {...register("foundLocation", { required: "Found location is required" })} />
          </Section>

          <Section title="Health and Safety" description="Initial assessment details for care planning and AI risk review.">
            <Select label="Initial Risk Level" {...register("risk", { required: "Risk level is required" })}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Select>
            <FormInput label="Medical Condition" icon={FiFileText} placeholder="Stable, needs review, medication, etc." error={formState.errors.medicalCondition?.message} {...register("medicalCondition", { required: "Medical condition is required" })} />
            <TextArea label="Identification Marks" placeholder="Birth marks, scars, clothing details" error={formState.errors.identificationMarks?.message} {...register("identificationMarks", { required: "Identification marks are required" })} />
            <TextArea label="Rescue / Admission Notes" placeholder="Brief verified intake notes" error={formState.errors.notes?.message} {...register("notes", { required: "Admission notes are required" })} />
          </Section>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => reset()}>
              Clear
            </Button>
            <Button type="submit" icon={FiSave}>
              Register Child
            </Button>
          </div>
        </form>
      </Card>

      <Modal open={Boolean(savedRecord)} title="Child Registered" onClose={() => setSavedRecord(null)}>
        <div className="flex gap-4">
          <div className="rounded-lg bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <FiCheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-slate-950 dark:text-white">{savedRecord?.name} has been registered successfully.</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Record ID: {savedRecord?.id}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => setSavedRecord(null)}>Done</Button>
        </div>
      </Modal>
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="grid gap-6 border-t border-slate-200 pt-6 dark:border-slate-800 xl:grid-cols-[260px_1fr]">
      <div>
        <h2 className="text-base font-bold text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Select({ label, error, children, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <select
        className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:ring-2 focus:ring-inset focus:ring-civic-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-900"
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}

function TextArea({ label, error, ...props }) {
  return (
    <label className="block md:col-span-2">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <textarea
        rows="4"
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-950 outline-none focus:ring-2 focus:ring-inset focus:ring-civic-500 focus:ring-offset-0 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        {...props}
      />
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
