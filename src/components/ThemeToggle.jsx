import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import Button from "./Button";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button variant="secondary" icon={isDark ? FiSun : FiMoon} onClick={toggleTheme} aria-label="Toggle theme" className="px-3">
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </Button>
  );
}
