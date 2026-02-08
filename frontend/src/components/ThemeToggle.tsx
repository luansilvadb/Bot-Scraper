import { Button } from '@fluentui/react-components';
import { WeatherMoon20Regular, WeatherSunny20Regular } from '@fluentui/react-icons';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Button
      icon={mode === 'light' ? <WeatherMoon20Regular /> : <WeatherSunny20Regular />}
      onClick={toggleTheme}
      appearance="subtle"
      aria-label="Toggle theme"
      title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    />
  );
};
