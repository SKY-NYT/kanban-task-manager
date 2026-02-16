import { useId, useMemo, useRef, useState } from "react";
import { Text } from "../atoms/Text";
import TextField from "../atoms/TextField";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Buttons";
import IconCross from "../../assets/images/icon-cross.svg?react";
import type { Column, Subtask, Task } from "../../types/types";

type TaskFormMode = "create" | "edit";

type TaskFormProps = {
  mode: TaskFormMode;
  columns: Column[];
  initialValue?: {
    title?: string;
    description?: string;
    status?: string;
    subtasks?: Subtask[];
  };
  submitDisabled?: boolean;
  onSubmit: (task: Task) => void;
};

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 500;
const SUBTASK_MAX = 100;

function getCrossIconClass(hasError: boolean) {
  return hasError ? "text-danger" : "text-[#828FA3] group-hover:text-danger";
}

export default function TaskForm({
  mode,
  columns,
  initialValue,
  submitDisabled,
  onSubmit,
}: TaskFormProps) {
  const titleMetaId = useId();
  const descriptionId = useId();
  const descriptionMetaId = useId();
  const subtaskMetaBaseId = useId();
  const summaryId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);

  const statusOptions = useMemo(
    () =>
      columns.map((col) => ({
        label: col.name,
        value: col.name,
      })),
    [columns],
  );

  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [description, setDescription] = useState(
    initialValue?.description ?? "",
  );
  const [status, setStatus] = useState(
    initialValue?.status ?? columns[0]?.name ?? "",
  );

  const [subtasks, setSubtasks] = useState<string[]>(
    initialValue?.subtasks?.length
      ? initialValue.subtasks.map((s) => s.title)
      : ["", ""],
  );

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [subtaskErrors, setSubtaskErrors] = useState<string[]>(
    Array.from({ length: subtasks.length }, () => ""),
  );
  const [formErrorSummary, setFormErrorSummary] = useState<string[]>([]);

  const setSubtasksWithErrors = (next: string[]) => {
    setSubtasks(next);
    setSubtaskErrors((prev) =>
      Array.from({ length: next.length }, (_, i) => prev[i] ?? ""),
    );
  };

  const validate = () => {
    const trimmedTitle = title.trim();
    let nextTitleError = "";
    if (trimmedTitle.length === 0) nextTitleError = "Can't be empty";
    else if (trimmedTitle.length > TITLE_MAX)
      nextTitleError = `Max ${TITLE_MAX} characters`;
    setTitleError(nextTitleError);

    const trimmedDescription = description.trim();
    let nextDescriptionError = "";
    if (trimmedDescription.length > DESCRIPTION_MAX) {
      nextDescriptionError = `Max ${DESCRIPTION_MAX} characters`;
    }
    setDescriptionError(nextDescriptionError);

    let nextStatusError = "";
    if (!status) nextStatusError = "Select a status";
    else if (!columns.some((c) => c.name === status))
      nextStatusError = "Invalid status";
    setStatusError(nextStatusError);

    const nextSubtaskErrors = subtasks.map((s) => {
      const trimmed = s.trim();
      if (trimmed.length === 0) return "Can't be empty";
      if (trimmed.length > SUBTASK_MAX) return `Max ${SUBTASK_MAX} characters`;
      return "";
    });
    setSubtaskErrors(nextSubtaskErrors);

    const hasErrors =
      Boolean(nextTitleError) ||
      Boolean(nextDescriptionError) ||
      Boolean(nextStatusError) ||
      nextSubtaskErrors.some(Boolean);

    if (hasErrors) {
      const nextSummary: string[] = [];
      if (nextTitleError) nextSummary.push(`Title: ${nextTitleError}`);
      if (nextDescriptionError)
        nextSummary.push(`Description: ${nextDescriptionError}`);
      if (nextStatusError) nextSummary.push(`Status: ${nextStatusError}`);
      nextSubtaskErrors.forEach((err, i) => {
        if (err) nextSummary.push(`Subtask ${i + 1}: ${err}`);
      });
      setFormErrorSummary(nextSummary);
      window.requestAnimationFrame(() => {
        summaryRef.current?.focus();
      });
    } else {
      setFormErrorSummary([]);
    }

    return !hasErrors;
  };

  const titleCount = title.length;
  const descriptionCount = description.length;

  const descriptionHasError = Boolean(descriptionError);
  const descriptionErrorId = `${descriptionId}-error`;
  const descriptionDescribedBy = [
    descriptionMetaId,
    descriptionHasError ? descriptionErrorId : undefined,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!validate()) return;

        const nextSubtasks: Subtask[] = subtasks.map((s, i) => ({
          title: s.trim(),
          isCompleted: initialValue?.subtasks?.[i]?.isCompleted ?? false,
        }));

        onSubmit({
          title: title.trim(),
          description,
          status,
          subtasks: nextSubtasks,
        });
      }}
    >
      {formErrorSummary.length > 0 && (
        <div
          ref={summaryRef}
          id={summaryId}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="rounded-sm border border-danger/50 bg-background-secondary px-4 py-3"
        >
          <Text variant="p6" className="text-danger font-bold">
            Please fix the following:
          </Text>
          <ul className="mt-2 list-disc pl-5">
            {formErrorSummary.map((msg) => (
              <li key={msg}>
                <Text variant="p6" className="text-danger">
                  {msg}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}

      <TextField
        label="Title"
        placeholder={
          mode === "create"
            ? "e.g. Take coffee break"
            : "e.g. Add authentication endpoints"
        }
        value={title}
        onChange={(e) => {
          const next = e.target.value;
          setTitle(next);
          if (formErrorSummary.length) setFormErrorSummary([]);
          if (titleError) {
            const trimmed = next.trim();
            if (trimmed.length === 0) setTitleError("Can't be empty");
            else if (trimmed.length > TITLE_MAX)
              setTitleError(`Max ${TITLE_MAX} characters`);
            else setTitleError("");
          }
        }}
        maxLength={TITLE_MAX + 50}
        fullWidth
        error={titleError}
        aria-describedby={titleMetaId}
      />

      <div className="-mt-4 flex justify-end">
        <Text
          id={titleMetaId}
          variant="p6"
          className={titleCount > TITLE_MAX ? "text-danger" : "text-gray-400"}
          aria-live="polite"
        >
          {titleCount}/{TITLE_MAX}
        </Text>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={descriptionId}>
          <Text variant="p6" className="text-gray-400">
            Description
          </Text>
        </label>
        {descriptionHasError ? (
          <textarea
            id={descriptionId}
            className={
              "w-full h-28 px-4 py-2 rounded-sm bg-background-secondary border outline-none focus:border-primary text-[13px] leading-6 resize-none transition-all placeholder:opacity-25 " +
              (descriptionHasError ? "border-danger" : "border-[#828fa340]")
            }
            placeholder={
              mode === "create"
                ? "e.g. It’s always good to take a break..."
                : "e.g. Define user model..."
            }
            value={description}
            onChange={(e) => {
              const next = e.target.value;
              setDescription(next);
              if (formErrorSummary.length) setFormErrorSummary([]);
              if (descriptionError) {
                setDescriptionError(
                  next.trim().length > DESCRIPTION_MAX
                    ? `Max ${DESCRIPTION_MAX} characters`
                    : "",
                );
              }
            }}
            aria-invalid="true"
            aria-describedby={descriptionDescribedBy}
          />
        ) : (
          <textarea
            id={descriptionId}
            className={
              "w-full h-28 px-4 py-2 rounded-sm bg-background-secondary border outline-none focus:border-primary text-[13px] leading-6 resize-none transition-all placeholder:opacity-25 " +
              (descriptionHasError ? "border-danger" : "border-[#828fa340]")
            }
            placeholder={
              mode === "create"
                ? "e.g. It’s always good to take a break..."
                : "e.g. Define user model..."
            }
            value={description}
            onChange={(e) => {
              const next = e.target.value;
              setDescription(next);
              if (formErrorSummary.length) setFormErrorSummary([]);
              if (descriptionError) {
                setDescriptionError(
                  next.trim().length > DESCRIPTION_MAX
                    ? `Max ${DESCRIPTION_MAX} characters`
                    : "",
                );
              }
            }}
            aria-invalid="false"
            aria-describedby={descriptionDescribedBy}
          />
        )}
        {descriptionHasError && (
          <Text
            id={descriptionErrorId}
            variant="p6"
            className="text-danger"
            role="alert"
          >
            {descriptionError}
          </Text>
        )}

        <div className="flex justify-end">
          <Text
            id={descriptionMetaId}
            variant="p6"
            className={
              descriptionCount > DESCRIPTION_MAX
                ? "text-danger"
                : "text-gray-400"
            }
            aria-live="polite"
          >
            {descriptionCount}/{DESCRIPTION_MAX}
          </Text>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Text variant="p6" className="text-gray-400 font-bold">
          Subtasks
        </Text>

        {subtasks.map((sub, index) => (
          <div key={index} className="flex items-center gap-4">
            {(() => {
              const subtaskCountId = `${subtaskMetaBaseId}-count-${index}`;
              return (
                <div className="flex w-full flex-col gap-2">
                  <TextField
                    placeholder={
                      mode === "create"
                        ? index === 0
                          ? "e.g. Make coffee"
                          : "e.g. Drink coffee & smile"
                        : "e.g. Define user model"
                    }
                    value={sub}
                    onChange={(e) => {
                      const next = e.target.value;
                      const updated = [...subtasks];
                      updated[index] = next;
                      setSubtasks(updated);
                      if (formErrorSummary.length) setFormErrorSummary([]);

                      if (subtaskErrors[index]) {
                        const trimmed = next.trim();
                        const nextErrors = [...subtaskErrors];
                        if (trimmed.length === 0)
                          nextErrors[index] = "Can't be empty";
                        else if (trimmed.length > SUBTASK_MAX)
                          nextErrors[index] = `Max ${SUBTASK_MAX} characters`;
                        else nextErrors[index] = "";
                        setSubtaskErrors(nextErrors);
                      }
                    }}
                    fullWidth
                    error={subtaskErrors[index]}
                    aria-describedby={subtaskCountId}
                  />
                  <div className="-mt-4 flex justify-end">
                    <Text
                      id={subtaskCountId}
                      variant="p6"
                      className={
                        sub.length > SUBTASK_MAX
                          ? "text-danger"
                          : "text-gray-400"
                      }
                      aria-live="polite"
                    >
                      {sub.length}/{SUBTASK_MAX}
                    </Text>
                  </div>
                </div>
              );
            })()}
            <button
              aria-label="Remove subtask"
              type="button"
              onClick={() => {
                const nextSubtasks = subtasks.filter((_, i) => i !== index);
                const nextErrors = subtaskErrors.filter((_, i) => i !== index);
                setSubtasks(nextSubtasks);
                setSubtaskErrors(nextErrors.length ? nextErrors : [""]);
                if (formErrorSummary.length) setFormErrorSummary([]);
              }}
              className="group transition-colors"
              disabled={subtasks.length <= 1}
            >
              <IconCross
                className={getCrossIconClass(Boolean(subtaskErrors[index]))}
              />
            </button>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => {
            const next = [...subtasks, ""];
            setSubtasksWithErrors(next);
            if (formErrorSummary.length) setFormErrorSummary([]);
          }}
          className="hover:bg-interactive-dynamic hover:text-primary"
        >
          + Add New Subtask
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Dropdown
          label="Status"
          value={status}
          options={statusOptions}
          onChange={(val) => {
            setStatus(val);
            if (formErrorSummary.length) setFormErrorSummary([]);
            if (statusError) setStatusError("");
          }}
          className="w-full"
        />
        {statusError && (
          <Text variant="p6" className="text-danger" role="alert">
            {statusError}
          </Text>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={submitDisabled}
      >
        {mode === "create" ? "Create Task" : "Save Changes"}
      </Button>
    </form>
  );
}
