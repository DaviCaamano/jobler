import '@components/shared/toggle/Toggle.css';
import { useSticky } from '@hooks/useSticky';
import { CSSProperties, ReactNode, useState } from 'react';

interface ToggleProps<T extends { on: unknown; off: unknown }> {
    // Values which will be passed to the setter based on whether it is toggled on or off
    values: T;
    // Set setter which runs when the button is pressed
    // if toggled on (right), value will be set to values.on
    // if toggled off (left), value will be set to values.off
    setValue: (value: T['on'] | T['off']) => void;
    // override internal logic for toggled state.
    // Expected to match value for either values.on or values.off
    value?: T['on'] | T['off'];
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
    // Set text style
    textStyle?: CSSProperties;
}
export const Toggle = <T extends { on: unknown; off: unknown }>({
    heightRem,
    labels,
    value,
    values: { on, off },
    setValue,
    widthRem,
    fullWidth,
    textStyle,
}: ToggleProps<T>) => {
    const [toggled, setToggled] = useState<boolean>(typeof value !== 'undefined' && value === on);

    useSticky(value, () => {
        setToggled(typeof value !== 'undefined' && value === on);
    });
    const handleToggle = () => {
        setToggled(!toggled);
        setValue(toggled ? off : on);
    };

    const width = widthRem ?? 6;
    const height = heightRem ?? 2.25;

    const trackStyle = {
        width: width + 'rem',
        height: height + 'rem',
    };
    const thumbDimensions = `${height - 0.4}rem`;
    const translateX = `${width - height}rem`;
    const toggleStyle: CSSProperties = {
        transform: toggled ? `translateX(${translateX}rem)` : undefined,
    };
    if (fullWidth) {
        toggleStyle.width = '100%';
    }
    const thumbStyle: CSSProperties = {
        height: thumbDimensions,
        width: thumbDimensions,
        transform: toggled ? `translateX(${translateX})` : 'translateX(0)',
    };

    return (
        <div className="toggle_container">
            <button
                className="toggle_toggle"
                onClick={handleToggle}
                aria-pressed={toggled}
                type="button"
            >
                <span className={`toggle_label left ${toggled ? 'off' : 'on'}`} style={textStyle}>
                    {labels?.off ?? 'On'}
                </span>
                <span className="toggle_track" style={trackStyle}>
                    <span className="toggle_thumb" style={thumbStyle} />
                </span>
                <span className={`toggle_label right ${toggled ? 'on' : 'off'}`} style={textStyle}>
                    {labels?.on ?? 'Off'}
                </span>
            </button>
        </div>
    );
};
