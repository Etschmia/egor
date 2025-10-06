import { COLORS } from '../utils/mapRenderer';

export function Legend() {
  return (
    <div style={{
      position: 'fixed',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '8px',
      padding: '1rem',
      maxHeight: '80vh',
      overflowY: 'auto',
      width: '250px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      zIndex: 100,
    }}>
      <h3 style={{ 
        margin: '0 0 1rem 0', 
        fontSize: '1.1rem',
        color: '#fff',
        borderBottom: '2px solid #4CAF50',
        paddingBottom: '0.5rem'
      }}>
        Legende
      </h3>

      {/* Tiles Section */}
      <Section title="Kacheln">
        <LegendItem color={COLORS.FLOOR} shape="square" label="Boden (0)" />
        <LegendItem color={COLORS.WALL} shape="square" label="Wand (1)" />
        <LegendItem color={COLORS.DOOR} shape="square" label="Tür (2)" />
        <LegendItem color={COLORS.EXIT_DOOR} shape="square" label="Ausgangstür (3)" />
      </Section>

      {/* Player Start Section */}
      <Section title="Spieler">
        <LegendItem 
          color={COLORS.PLAYER_START} 
          shape="circle" 
          label="Startposition" 
          icon="→"
        />
      </Section>

      {/* Enemies Section */}
      <Section title="Gegner (Kreise)">
        <LegendItem 
          color={COLORS.ENEMIES.ZOMBIE} 
          shape="circle" 
          label="Zombie" 
          icon="Z"
        />
        <LegendItem 
          color={COLORS.ENEMIES.MONSTER} 
          shape="circle" 
          label="Monster" 
          icon="M"
        />
        <LegendItem 
          color={COLORS.ENEMIES.GHOST} 
          shape="circle" 
          label="Geist" 
          icon="G"
        />
        <LegendItem 
          color={COLORS.ENEMIES.DOG} 
          shape="circle" 
          label="Hund" 
          icon="D"
        />
      </Section>

      {/* Items Section */}
      <Section title="Gegenstände (Diamanten)">
        <LegendItem 
          color={COLORS.ITEMS.HEALTH_SMALL} 
          shape="diamond" 
          label="Kleine Heilung" 
          icon="H"
        />
        <LegendItem 
          color={COLORS.ITEMS.HEALTH_LARGE} 
          shape="diamond" 
          label="Große Heilung" 
          icon="H+"
        />
        <LegendItem 
          color={COLORS.ITEMS.TREASURE} 
          shape="diamond" 
          label="Schatz" 
          icon="T"
        />
        <LegendItem 
          color={COLORS.ITEMS.AMMO} 
          shape="diamond" 
          label="Munition" 
          icon="A"
        />
        <LegendItem 
          color={COLORS.ITEMS.WEAPON} 
          shape="diamond" 
          label="Waffe" 
          icon="W"
        />
      </Section>

      {/* Decorative Objects Section */}
      <Section title="Dekorative Objekte (Quadrate)">
        <LegendItem 
          color={COLORS.DECORATIVE} 
          shape="square" 
          label="Deckenlampe" 
          icon="L"
          small
        />
        <LegendItem 
          color={COLORS.DECORATIVE} 
          shape="square" 
          label="Vase" 
          icon="V"
          small
        />
        <LegendItem 
          color={COLORS.DECORATIVE} 
          shape="square" 
          label="Kiste" 
          icon="C"
          small
        />
        <LegendItem 
          color={COLORS.DECORATIVE} 
          shape="square" 
          label="Bank" 
          icon="B"
          small
        />
        <LegendItem 
          color={COLORS.DECORATIVE} 
          shape="square" 
          label="Tisch" 
          icon="T"
          small
        />
        <LegendItem 
          color={COLORS.DECORATIVE} 
          shape="square" 
          label="Stuhl" 
          icon="Ch"
          small
        />
        <LegendItem 
          color={COLORS.DECORATIVE} 
          shape="square" 
          label="Weinflasche" 
          icon="W"
          small
        />
        <LegendItem 
          color={COLORS.DECORATIVE} 
          shape="square" 
          label="Skelett" 
          icon="S"
          small
        />
      </Section>

      {/* Wall Pictures Section */}
      <Section title="Wandbilder">
        <LegendItem 
          color={COLORS.WALL_PICTURE} 
          shape="rectangle" 
          label="Wandbild" 
          icon="P"
        />
      </Section>

      {/* Selection Indicator */}
      <Section title="Interaktion">
        <LegendItem 
          color={COLORS.SELECTION} 
          shape="outline" 
          label="Ausgewähltes Element" 
        />
        <LegendItem 
          color={COLORS.HOVER} 
          shape="square" 
          label="Hover-Effekt" 
        />
      </Section>

      {/* Keyboard Shortcuts */}
      <Section title="Tastenkombinationen">
        <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.6' }}>
          <div><kbd>Rechtsklick</kbd> - Kontextmenü</div>
          <div><kbd>Linksklick</kbd> - Element auswählen</div>
          <div><kbd>Entf</kbd> - Element löschen</div>
          <div><kbd>Strg+S</kbd> - Speichern</div>
          <div><kbd>Strg+Z</kbd> - Rückgängig</div>
          <div><kbd>Strg+Y</kbd> - Wiederholen</div>
          <div><kbd>Esc</kbd> - Abbrechen/Abwählen</div>
        </div>
      </Section>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4 style={{ 
        margin: '0 0 0.5rem 0', 
        fontSize: '0.9rem',
        color: '#4CAF50',
        fontWeight: 600
      }}>
        {title}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {children}
      </div>
    </div>
  );
}

interface LegendItemProps {
  color: string;
  shape: 'square' | 'circle' | 'diamond' | 'rectangle' | 'outline';
  label: string;
  icon?: string;
  small?: boolean;
}

function LegendItem({ color, shape, label, icon, small }: LegendItemProps) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.6rem',
      fontSize: '0.85rem',
      color: '#ddd'
    }}>
      <div style={{ 
        position: 'relative',
        width: small ? '20px' : '24px',
        height: small ? '20px' : '24px',
        flexShrink: 0
      }}>
        <ShapeIcon color={color} shape={shape} small={small} />
        {icon && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: small ? '8px' : '10px',
            fontWeight: 'bold',
            color: shape === 'outline' ? color : (color === COLORS.FLOOR || color === COLORS.DECORATIVE ? '#fff' : '#000'),
            textShadow: shape === 'outline' ? 'none' : '0 0 2px rgba(0,0,0,0.5)'
          }}>
            {icon}
          </div>
        )}
      </div>
      <span>{label}</span>
    </div>
  );
}

interface ShapeIconProps {
  color: string;
  shape: 'square' | 'circle' | 'diamond' | 'rectangle' | 'outline';
  small?: boolean;
}

function ShapeIcon({ color, shape, small }: ShapeIconProps) {
  const size = small ? '20px' : '24px';
  
  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor: shape === 'outline' ? 'transparent' : color,
    border: shape === 'outline' ? `2px solid ${color}` : '1px solid #000',
  };

  if (shape === 'square' || shape === 'rectangle') {
    return (
      <div style={{
        ...baseStyle,
        borderRadius: '2px',
      }} />
    );
  }

  if (shape === 'circle') {
    return (
      <div style={{
        ...baseStyle,
        borderRadius: '50%',
      }} />
    );
  }

  if (shape === 'diamond') {
    return (
      <div style={{
        width: size,
        height: size,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: small ? '14px' : '17px',
          height: small ? '14px' : '17px',
          backgroundColor: color,
          border: '1px solid #000',
          transform: 'translate(-50%, -50%) rotate(45deg)',
        }} />
      </div>
    );
  }

  return null;
}

// Keyboard key component styling
const kbdStyle = document.createElement('style');
kbdStyle.textContent = `
  kbd {
    background-color: #1e1e1e;
    border: 1px solid #555;
    border-radius: 3px;
    padding: 2px 6px;
    font-family: monospace;
    font-size: 0.8rem;
    color: #4CAF50;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
`;
document.head.appendChild(kbdStyle);

