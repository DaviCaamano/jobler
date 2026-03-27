import { useRef, useState } from 'react';
import { CirclePlus } from 'lucide-react';
import { useSticky } from '@hooks/useSticky';

const inputName = 'add-filter-button_input';

interface AddFilterButtonProps {
    onSubmit: (value: string) => void | Promise<void>;
    placeholder?: string;
}

export const AddFilterButton = ({ onSubmit, placeholder }: AddFilterButtonProps) => {
    const [showInput, setShowInput] = useState<boolean>(false);
    const [newFilter, setNewFilter] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    useSticky(showInput, () => {
        if (showInput) {
            inputRef.current?.focus();
        } else {
            setNewFilter('');
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const value = String(formData.get(inputName) ?? '').trim();

        if (!value) {
            setShowInput(false);
            return;
        }

        await onSubmit(value);
        setShowInput(false);
    };

    return (
        <div className="add-filter-button_container">
            {showInput ? (
                <form onSubmit={handleSubmit} className="add-filter-button_input-container">
                    <input
                        className="add-filter-button_input"
                        name={inputName}
                        onBlur={() => setShowInput(false)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewFilter(e.target.value)
                        }
                        placeholder={placeholder ?? 'Add filter'}
                        ref={inputRef}
                        value={newFilter}
                    />
                    <button type="submit" onMouseDown={(e) => e.preventDefault()}>
                        <CirclePlus className="add-filter-button_submit-button" />
                    </button>
                </form>
            ) : (
                <button
                    className="add-filter-button_button button-lighting"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowInput(true);
                    }}
                >
                    <CirclePlus className="add-filter-button_icon" />
                </button>
            )}
        </div>
    );
};
