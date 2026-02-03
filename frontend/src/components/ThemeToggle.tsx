import { Button } from '@fluentui/react-components';
import { WeatherMoon20Regular, WeatherSunny20Regular } from '@fluentui/react-icons';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
    const { themeMode, toggleTheme } = useTheme();

    return (
        <Button
            icon={themeMode === 'light' ? <WeatherMoon20Regular /> : <WeatherSunny20Regular />}
            onClick={toggleTheme}
            appearance="subtle"
            aria-label="Toggle theme"
            title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
        />
    );
};
