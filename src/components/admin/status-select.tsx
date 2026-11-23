"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus } from "@/app/actions/admin";

export function StatusSelect({
  id,
  status,
  labels,
}: {
  id: string;
  status: string;
  labels: Array<{ value: string; label: string }>;
}) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label="Lead status"
      value={value}
      disabled={pending}
      onChange={(event) => {
        const next = event.target.value;
        setValue(next);
        startTransition(async () => {
          const result = await updateLeadStatus(id, next);
          if (!result.ok) setValue(status);
        });
      }}
    >
      {labels.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
