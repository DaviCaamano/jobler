import '@components/shared/toggle/Toggle.css';
import { Setter } from '@interfaces/react-state';
import { CSSProperties, ReactNode, useState } from 'react';

interface ToggleProps<T> {
    // Values which will be passed to the setter based on whether it is toggled on or off
    values: {
        on: T;
        off: T;
    };
    // Set setter which runs when the button is pressed
    // if toggled on (right), value will be set to values.on
    // if toggled off (left), value will be set to values.off
    setValue: Setter<T>;
    // Initial value of toggle, sets toggle to on if defaultValue === values.on
    defaultValue?: T;
    // What text is shown on the left and right side of the toggle.
    labels?: {
        on?: ReactNode; // defaults to 'On'
        off?: ReactNode; // defaults to 'Off'
    };
    // Width in Rem
    widthRem?: number;
    // Height in Rem;
    heightRem?: number;
    // Set True if you want the entire horizontal space around the toggle to also trigger the toggle.
    fullWidth?: boolean;
}
export const Toggle = <T,>({
    defaultValue,
    heightRem,
    labels,
    values: { on, off },
    setValue,
    widthRem,
    fullWidth,
}: ToggleProps<T>) => {
    const [toggled, setToggled] = useState<boolean>(
        typeof defaultValue !== 'undefined' && defaultValue === on
    );

    const handleToggle = () => {
        setToggled(!toggled);
        setValue(toggled ? off : on);
    };

    const width = widthRem ?? 8;
    const height = heightRem ?? 3;

    const trackStyle = {
        width: width + 'rem',
        height: height + 'rem',
    };
    const thumbDimensions = height - 0.4 + 'rem';
    const translateX = width - height + 'rem';
    const toggleStyle: CSSProperties = {
        transform: toggled ? `translateX(${translateX}rem)` : undefined,
    };
    if (fullWidth) {
        toggleStyle.width = '100%';
    }
    const thumbStyle = {
        height: thumbDimensions,
        width: thumbDimensions,
        transform: `translateX(${translateX}rem)`,
    };

    return (
        <div className="__jobler__toggle_container">
            <button
                className={`__jobler__toggle_toggle ${toggled ? 'on' : 'off'}`}
                onClick={handleToggle}
                aria-pressed={toggled}
                style={toggleStyle}
                type="button"
            >
                <span className={`__jobler__toggle_label ${toggled ? 'off' : 'on'}`}>
                    {labels?.off ?? 'On'}
                </span>
                <span className="__jobler__toggle_track" style={trackStyle}>
                    <span className="__jobler__toggle_thumb" style={thumbStyle} />
                </span>
                <span className={`__jobler__toggle_label ${toggled ? 'on' : 'off'}`}>
                    {labels?.on ?? 'Off'}
                </span>
            </button>
        </div>
    );
};
