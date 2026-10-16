"use client";

import { IconCheck, IconWifiOff } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatValidOptions } from "@/lib/format";
import { parseOptions } from "@/lib/options";

export interface OptionsFormProps {
  casting: boolean;
  error: string | null;
  /** Pre-fills the field when returning from a result via "Edit options". */
  initialText?: string;
  onCast: (options: string[]) => void;
}

/**
 * The options editor. It owns its own text state so that typing does not
 * re-render the screen around it, and validation is live rather than on submit:
 * exactly one status line is shown, reflecting the current count.
 */
export function OptionsForm({
  casting,
  error,
  initialText = "",
  onCast,
}: OptionsFormProps) {
  const [text, setText] = useState(initialText);
  const options = useMemo(() => parseOptions(text), [text]);

  const canCast = options.length >= 2 && !casting;

  return (
    <div className="mt-7">
      <label htmlFor="options" className="block text-[15px] font-semibold leading-5">
        Your options
      </label>

      <textarea
        id="options"
        name="options"
        rows={6}
        value={text}
        disabled={casting}
        aria-describedby="options-status"
        onChange={(event) => setText(event.target.value)}
        placeholder={"Option A\nOption B\nOption C"}
        className="mt-2 block h-[212px] w-full resize-none rounded-field border-[1.5px] border-hairline bg-surface px-4 py-3.5 text-[15.5px] leading-[26px] text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-muted/55 focus:border-primary focus:shadow-[0_0_0_3px_var(--focus-ring)] focus:outline-hidden"
      />

      <div id="options-status" className="pt-3">
        {options.length === 0 ? (
          <p className="text-[13.5px] leading-5 text-muted">
            No options yet — add at least two.
          </p>
        ) : options.length === 1 ? (
          <p className="text-[13.5px] leading-5 text-warn">
            {formatValidOptions(1)} — need at least 2
          </p>
        ) : (
          <p className="flex items-center gap-1.5 text-[13.5px] font-medium leading-5 text-success">
            <IconCheck aria-hidden="true" size={16} stroke={2} />
            {formatValidOptions(options.length)}
          </p>
        )}
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-[13.5px] leading-5 text-danger">
          {error}
        </p>
      ) : null}

      <Button fullWidth className="mt-8" disabled={!canCast} onClick={() => onCast(options)}>
        {casting ? "Casting…" : "Cast lots"}
      </Button>

      <p className="mt-4 flex items-start gap-2 text-[13.5px] leading-5 text-muted">
        <span aria-hidden="true" className="mt-px shrink-0">
          <IconWifiOff size={18} stroke={1.75} />
        </span>
        <span>Runs in your browser. Nothing you type is sent anywhere.</span>
      </p>
    </div>
  );
}
