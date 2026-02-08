'use client';

interface SaveButtonProps {
  loading: boolean;
  isEdit: boolean;
}

export function SaveButton({ loading, isEdit }: SaveButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm font-medium"
    >
      {loading ? '저장 중...' : isEdit ? '저장' : '등록'}
    </button>
  );
}

interface CancelButtonProps {
  onClick: () => void;
}

export function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-2 border border-border text-text-secondary rounded-lg hover:bg-bg-secondary transition-colors text-sm"
    >
      취소
    </button>
  );
}

interface ListButtonProps {
  onClick: () => void;
}

export function ListButton({ onClick }: ListButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-bg-secondary transition-colors text-sm"
    >
      목록
    </button>
  );
}

interface EditButtonProps {
  onClick: () => void;
}

export function EditButton({ onClick }: EditButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
    >
      수정
    </button>
  );
}

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function DeleteButton({ onClick, disabled }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
    >
      삭제
    </button>
  );
}

interface BackToListButtonProps {
  onClick: () => void;
}

export function BackToListButton({ onClick }: BackToListButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
    >
      목록으로 돌아가기
    </button>
  );
}
