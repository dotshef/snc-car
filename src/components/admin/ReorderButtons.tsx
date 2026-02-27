interface ReorderButtonsProps {
  onUp: (e: React.MouseEvent) => void;
  onDown: (e: React.MouseEvent) => void;
  disabledUp: boolean;
  disabledDown: boolean;
}

export default function ReorderButtons({ onUp, onDown, disabledUp, disabledDown }: ReorderButtonsProps) {
  const btnClass = (disabled: boolean) =>
    `p-1 rounded transition-colors ${
      disabled
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-text-secondary hover:text-primary hover:bg-bg-secondary'
    }`;

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={disabledUp}
        onClick={onUp}
        className={btnClass(disabledUp)}
        title="위로 이동"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
      <button
        type="button"
        disabled={disabledDown}
        onClick={onDown}
        className={btnClass(disabledDown)}
        title="아래로 이동"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
