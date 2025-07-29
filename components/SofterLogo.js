// Componente del logo de Softer
const SofterLogo = ({ showText = true }) => {
  return (
    <div className="flex items-center">
      {/* Texto del logo */}
      {showText && (
        <span className="text-2xl text-black tracking-wider" style={{ fontFamily: 'Times New Roman, serif' }}>
          SOFTER
        </span>
      )}
    </div>
  );
};

export default SofterLogo;