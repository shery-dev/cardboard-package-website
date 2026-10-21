import React from 'react';

/**
 * Unified CAD Die Mold Geometry Renderer for all 17 Box Types.
 * Serves as the single source of truth for both:
 * 1. Technical "Die Mold Blueprint" view (CAD cut/crease specs, FEFCO dimensions)
 * 2. Interactive "2D Design Net" view (clickable panels, custom colors, image overlay, and 3D texture mapping)
 */
export function renderDieMoldCAD({
  id,
  mode = 'interactive', // 'interactive' | 'blueprint'
  onClick = () => {},
  getFill = () => '#FFFDFC',
  activeSection = null,
  len = 10,
  wid = 10,
  dep = 4,
}) {
  const isInteractive = mode === 'interactive';

  const panelFill = (sideKey, defaultBpFill = '#FFFDFC') => {
    if (isInteractive) return getFill(sideKey);
    return defaultBpFill;
  };

  const panelStroke = (sideKey, defaultWidth = 2) => {
    if (isInteractive && activeSection === sideKey) {
      return { stroke: '#A94F32', strokeWidth: 3.5 };
    }
    return { stroke: '#DC2626', strokeWidth: defaultWidth };
  };

  const handlePanelClick = (sideKey) => {
    if (isInteractive && onClick) onClick(sideKey);
  };

  switch (id) {
    case 'pizzaSlice':
      // Triangular wedge slice die net (TRI-SLICE-01)
      return (
        <g id="dieline-pizza-slice">
          {/* Triangular Top Lid */}
          <polygon
            points="270,30 150,220 390,220"
            fill={panelFill('top', '#FFFDFC')}
            {...panelStroke('top', 2.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
            onClick={() => handlePanelClick('top')}
          />
          <line x1="150" y1="220" x2="390" y2="220" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="270" y="150" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            TRIANGULAR TOP LID
          </text>
          <text x="270" y="168" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">
            {wid}″ Crust × {len}″ Tip
          </text>

          {/* Crust Wall (Hinge Spine) */}
          <rect
            x="150" y="220" width="240" height="42"
            fill={panelFill('back', '#F7F3ED')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <line x1="150" y1="262" x2="390" y2="262" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="270" y="246" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            CRUST WALL ({dep}″)
          </text>

          {/* Triangular Base Tray */}
          <polygon
            points="270,410 150,262 390,262"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="325" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            BASE TRAY
          </text>

          {/* Left Taper Wing */}
          <polygon
            points="150,220 150,262 60,262"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="150" y1="220" x2="150" y2="262" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="120" y="250" fontSize="9" fontWeight="bold" fill="#6B584D" pointerEvents="none">LEFT</text>

          {/* Right Taper Wing */}
          <polygon
            points="390,220 390,262 480,262"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="390" y1="220" x2="390" y2="262" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="405" y="250" fontSize="9" fontWeight="bold" fill="#6B584D" pointerEvents="none">RIGHT</text>

          {/* Point-Tip Locking Tab */}
          <path
            d="M260,30 L280,30 L275,10 L265,10 Z"
            fill={panelFill('lidFront', '#D97706')}
            fillOpacity={isInteractive ? 1 : 0.4}
            {...panelStroke('lidFront', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('lidFront')}
          />
          <text x="270" y="24" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#D97706" pointerEvents="none">TIP TAB</text>
        </g>
      );

    case 'cakeBox':
      // Bakery Cake Box with Gable Handle and Drop-Down Wall (FEFCO 0426-H)
      return (
        <g id="dieline-cake-box">
          {/* Top Crown Carry Handle */}
          <path
            d="M195,60 L195,20 Q270,5 345,20 L345,60 Z"
            fill={panelFill('lidFront', '#F7F3ED')}
            {...panelStroke('lidFront', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('lidFront')}
          />
          <rect x="235" y="30" width="70" height="18" rx="9" fill="#FFFDFC" stroke="#DC2626" strokeWidth="2" pointerEvents="none" />
          <text x="270" y="43" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A94F32" pointerEvents="none">CROWN HANDLE</text>
          <line x1="195" y1="60" x2="345" y2="60" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Top Lid */}
          <rect
            x="195" y="60" width="150" height="95"
            fill={panelFill('top', '#FFFDFC')}
            {...panelStroke('top', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('top')}
          />
          <text x="270" y="112" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">TOP CAKE LID</text>
          <line x1="195" y1="155" x2="345" y2="155" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Back Display Wall */}
          <rect
            x="195" y="155" width="150" height="85"
            fill={panelFill('back', '#F7F3ED')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="270" y="202" textAnchor="middle" fontSize="11" fill="#6B584D" pointerEvents="none">BACK DISPLAY WALL ({dep}″)</text>
          <line x1="195" y1="240" x2="345" y2="240" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Bottom Cake Tray Base */}
          <rect
            x="195" y="240" width="150" height="100"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="295" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            CAKE TRAY BASE ({len}″×{wid}″)
          </text>
          <line x1="195" y1="340" x2="345" y2="340" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Front Drop-Down Loading Wall */}
          <rect
            x="195" y="340" width="150" height="65"
            fill={panelFill('front', '#F7F3ED')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <circle cx="270" cy="340" r="12" fill="#FAF8F5" stroke="#DC2626" strokeWidth="1.5" pointerEvents="none" />
          <text x="270" y="380" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#A94F32" pointerEvents="none">
            DROP-DOWN FRONT WALL
          </text>

          {/* Left Lock-Corner Wall */}
          <polygon
            points="195,240 195,340 85,340 85,260 115,240"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="195" y1="240" x2="195" y2="340" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="140" y="295" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">LEFT LOCK</text>

          {/* Right Lock-Corner Wall */}
          <polygon
            points="345,240 345,340 455,340 455,260 425,240"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="345" y1="240" x2="345" y2="340" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="400" y="295" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">RIGHT LOCK</text>
        </g>
      );

    case 'kraftPaper':
      // SOS Gusseted Kraft Paper Bag (BAG-SOS-01)
      return (
        <g id="dieline-kraft-bag">
          {/* Serrated Pinked Top Edge Cut */}
          <path
            d="M70,40 L90,30 L110,40 L130,30 L150,40 L170,30 L190,40 L210,30 L230,40 L250,30 L270,40 L290,30 L310,40 L330,30 L350,40 L370,30 L390,40 L410,30 L430,40 L450,30 L470,40"
            fill="none" stroke="#DC2626" strokeWidth="2"
          />

          {/* 4 Handle Punch Holes */}
          <circle cx="160" cy="65" r="5" fill="#2B211B" />
          <circle cx="220" cy="65" r="5" fill="#2B211B" />
          <circle cx="320" cy="65" r="5" fill="#2B211B" />
          <circle cx="380" cy="65" r="5" fill="#2B211B" />
          <line x1="70" y1="85" x2="470" y2="85" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Front Panel */}
          <rect
            x="130" y="85" width="120" height="245"
            fill={panelFill('front', '#FFFDFC')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <text x="190" y="210" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            BAG FRONT ({len}″×{wid}″)
          </text>

          {/* Back Panel */}
          <rect
            x="290" y="85" width="120" height="245"
            fill={panelFill('back', '#FFFDFC')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="350" y="210" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            BAG BACK
          </text>

          {/* Center Gusset */}
          <rect
            x="250" y="85" width="40" height="245"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="270" y1="85" x2="270" y2="330" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="270" y="160" textAnchor="middle" fontSize="9" fill="#6B584D" transform="rotate(90, 270, 160)" pointerEvents="none">
            CENTER GUSSET
          </text>

          {/* Outer Gusset Panels */}
          <rect
            x="70" y="85" width="60" height="245"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="100" y1="85" x2="100" y2="330" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3 3" />

          <rect
            x="410" y="85" width="60" height="245"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="440" y1="85" x2="440" y2="330" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Hexagonal Pinch Bottom Flaps */}
          <line x1="70" y1="330" x2="470" y2="330" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <polygon
            points="100,330 130,395 250,395 220,330"
            fill={panelFill('bottom', '#EADFD5')}
            {...panelStroke('bottom', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <polygon
            points="260,330 290,395 410,395 380,330"
            fill={panelFill('lidFront', '#EADFD5')}
            {...panelStroke('lidFront', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('lidFront')}
          />
          <text x="270" y="375" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6B584D" pointerEvents="none">
            HEX PINCH BOTTOM
          </text>
        </g>
      );

    case 'toolBox':
      // Workshop Tool Box with Carry Handle Cutout (FEFCO 0217-TB)
      return (
        <g id="dieline-tool-box">
          {/* Top Handle Lid */}
          <rect
            x="180" y="30" width="180" height="90"
            fill={panelFill('top', '#FFFDFC')}
            {...panelStroke('top', 2.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('top')}
          />
          {/* Handle Grip Punchout */}
          <rect x="220" y="65" width="100" height="24" rx="12" fill="#EADFD5" stroke="#DC2626" strokeWidth="2" pointerEvents="none" />
          <text x="270" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#A94F32" pointerEvents="none">
            HEAVY CARRY HANDLE
          </text>
          <line x1="180" y1="120" x2="360" y2="120" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Back Hinge Wall */}
          <rect
            x="180" y="120" width="180" height="80"
            fill={panelFill('back', '#F7F3ED')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="270" y="165" textAnchor="middle" fontSize="11" fill="#6B584D" pointerEvents="none">BACK HINGE ({dep}″)</text>
          <line x1="180" y1="200" x2="360" y2="200" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Bottom Tool Bed */}
          <rect
            x="180" y="200" width="180" height="110"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            TOOL BED ({len}″×{wid}″)
          </text>
          <line x1="180" y1="310" x2="360" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Front Wall with Dual Latches */}
          <rect
            x="180" y="310" width="180" height="70"
            fill={panelFill('front', '#F7F3ED')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <rect x="205" y="380" width="30" height="20" rx="4" fill="#D97706" fillOpacity="0.5" stroke="#DC2626" strokeWidth="1.5" pointerEvents="none" />
          <rect x="305" y="380" width="30" height="20" rx="4" fill="#D97706" fillOpacity="0.5" stroke="#DC2626" strokeWidth="1.5" pointerEvents="none" />
          <text x="270" y="350" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            DUAL LATCH FRONT
          </text>

          {/* Left & Right End Walls */}
          <rect
            x="70" y="200" width="110" height="110"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="180" y1="200" x2="180" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="125" y="260" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">LEFT SIDE</text>

          <rect
            x="360" y="200" width="110" height="110"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="360" y1="200" x2="360" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="415" y="260" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">RIGHT SIDE</text>
        </g>
      );

    case 'laptopBox':
      // Electronics Laptop Box with Shock Chambers & Cable Bay (FEFCO 0427-TECH)
      return (
        <g id="dieline-laptop-box">
          {/* Top Lid */}
          <rect
            x="170" y="30" width="200" height="110"
            fill={panelFill('top', '#FFFDFC')}
            {...panelStroke('top', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('top')}
          />
          <text x="270" y="90" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            TOP SCREEN COVER
          </text>
          <line x1="170" y1="140" x2="370" y2="140" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Back Wall */}
          <rect
            x="170" y="140" width="200" height="50"
            fill={panelFill('back', '#F7F3ED')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="270" y="170" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">BACK HINGE ({dep}″)</text>
          <line x1="170" y1="190" x2="370" y2="190" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Base Laptop Bed */}
          <rect
            x="170" y="190" width="200" height="120"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="255" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            NOTEBOOK CRADLE ({len}″×{wid}″)
          </text>
          <line x1="170" y1="310" x2="370" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Front Wall + Cable Compartment Flap */}
          <rect
            x="170" y="310" width="200" height="50"
            fill={panelFill('front', '#F7F3ED')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <line x1="170" y1="360" x2="370" y2="360" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <rect
            x="180" y="360" width="180" height="40"
            fill={panelFill('lidFront', '#EADFD5')}
            {...panelStroke('lidFront', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('lidFront')}
          />
          <text x="270" y="385" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A94F32" pointerEvents="none">
            CHARGER / ACCESSORY DIVIDER
          </text>

          {/* Left Shock-Absorbing Buffer Wing */}
          <rect
            x="60" y="190" width="110" height="120"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="115" y1="190" x2="115" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="170" y1="190" x2="170" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="115" y="255" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A94F32" pointerEvents="none">
            20mm SHOCK BUFFER
          </text>

          {/* Right Shock-Absorbing Buffer Wing */}
          <rect
            x="370" y="190" width="110" height="120"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="425" y1="190" x2="425" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="370" y1="190" x2="370" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="425" y="255" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A94F32" pointerEvents="none">
            20mm SHOCK BUFFER
          </text>
        </g>
      );

    case 'ecommerce':
      // DTC Ecommerce Mailer with Red Tear Strip & Zipper (FEFCO 0427-ZIP)
      return (
        <g id="dieline-ecommerce">
          {/* Top Lid with Tear Strip */}
          <rect
            x="180" y="30" width="180" height="100"
            fill={panelFill('top', '#FFFDFC')}
            {...panelStroke('top', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('top')}
          />
          <text x="270" y="85" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            UNBOXING REVEAL LID
          </text>
          {/* Red Peel-and-Seal Strip */}
          <rect
            x="185" y="35" width="170" height="14" rx="2"
            fill={isInteractive && activeSection === 'lidFront' ? '#A94F32' : '#DC2626'}
            fillOpacity={0.9}
            stroke="#DC2626"
            strokeWidth="1.5"
            className={isInteractive ? 'cursor-pointer' : ''}
            onClick={() => handlePanelClick('lidFront')}
          />
          <text x="270" y="45" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FFFFFF" pointerEvents="none">
            PEEL & SEAL ADHESIVE STRIP
          </text>
          {/* Perforated Tear-Tape Line */}
          <line x1="185" y1="58" x2="355" y2="58" stroke="#EA580C" strokeWidth="2" strokeDasharray="3 3" pointerEvents="none" />
          <text x="270" y="70" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#EA580C" pointerEvents="none">
            ZIP TEAR TAPE ───▶
          </text>
          <line x1="180" y1="130" x2="360" y2="130" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Back Wall */}
          <rect
            x="180" y="130" width="180" height="60"
            fill={panelFill('back', '#F7F3ED')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="270" y="165" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">BACK SPINE ({dep}″)</text>
          <line x1="180" y1="190" x2="360" y2="190" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Bottom Tray Base */}
          <rect
            x="180" y="190" width="180" height="120"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="255" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            BOTTOM BASE TRAY ({len}″×{wid}″)
          </text>
          <line x1="180" y1="310" x2="360" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Front Wall */}
          <rect
            x="180" y="310" width="180" height="60"
            fill={panelFill('front', '#F7F3ED')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <text x="270" y="345" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">FRONT ROLL WALL</text>

          {/* Roll-Over Side Wings */}
          <rect
            x="80" y="190" width="100" height="120"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="180" y1="190" x2="180" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="130" y="255" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">LEFT ROLL</text>

          <rect
            x="360" y="190" width="100" height="120"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="360" y1="190" x2="360" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="410" y="255" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">RIGHT ROLL</text>
        </g>
      );

    case 'ration':
      // Heavy-Duty Ration Carton with Oval Hand-Holes (FEFCO 0201-HD)
      return (
        <g id="dieline-ration">
          {/* 4 Top Flaps */}
          <rect x="40" y="30" width="100" height="70" fill={panelFill('top', '#F7F3ED')} {...panelStroke('top', 2)} onClick={() => handlePanelClick('top')} />
          <rect x="140" y="30" width="140" height="70" fill={panelFill('top', '#F7F3ED')} {...panelStroke('top', 2)} onClick={() => handlePanelClick('top')} />
          <rect x="280" y="30" width="100" height="70" fill={panelFill('top', '#F7F3ED')} {...panelStroke('top', 2)} onClick={() => handlePanelClick('top')} />
          <rect x="380" y="30" width="140" height="70" fill={panelFill('top', '#F7F3ED')} {...panelStroke('top', 2)} onClick={() => handlePanelClick('top')} />
          <line x1="40" y1="100" x2="520" y2="100" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Left End Wall with Hand Hole */}
          <rect
            x="40" y="100" width="100" height="180"
            fill={panelFill('left', '#FFFDFC')}
            {...panelStroke('left', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <rect x="65" y="170" width="50" height="20" rx="10" fill="#EADFD5" stroke="#DC2626" strokeWidth="2" pointerEvents="none" />
          <text x="90" y="205" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#A94F32" pointerEvents="none">HAND HOLE</text>

          {/* Front Face */}
          <rect
            x="140" y="100" width="140" height="180"
            fill={panelFill('front', '#FFFDFC')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <text x="210" y="195" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            FRONT FACE ({len}″)
          </text>

          {/* Right End Wall with Hand Hole */}
          <rect
            x="280" y="100" width="100" height="180"
            fill={panelFill('right', '#FFFDFC')}
            {...panelStroke('right', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <rect x="305" y="170" width="50" height="20" rx="10" fill="#EADFD5" stroke="#DC2626" strokeWidth="2" pointerEvents="none" />
          <text x="330" y="205" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#A94F32" pointerEvents="none">HAND HOLE</text>

          {/* Back Face */}
          <rect
            x="380" y="100" width="140" height="180"
            fill={panelFill('back', '#FFFDFC')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="450" y="195" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            BACK FACE
          </text>

          {/* Glue Tab */}
          <polygon points="40,100 15,115 15,265 40,280" fill="#D97706" fillOpacity="0.4" stroke="#DC2626" strokeWidth="1.5" />
          <text x="28" y="195" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#D97706" transform="rotate(-90, 28, 195)" pointerEvents="none">
            GLUE TAB
          </text>

          {/* 4 Bottom Flaps */}
          <line x1="40" y1="280" x2="520" y2="280" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <rect x="40" y="280" width="100" height="70" fill={panelFill('bottom', '#F7F3ED')} {...panelStroke('bottom', 2)} onClick={() => handlePanelClick('bottom')} />
          <rect x="140" y="280" width="140" height="70" fill={panelFill('bottom', '#F7F3ED')} {...panelStroke('bottom', 2)} onClick={() => handlePanelClick('bottom')} />
          <rect x="280" y="280" width="100" height="70" fill={panelFill('bottom', '#F7F3ED')} {...panelStroke('bottom', 2)} onClick={() => handlePanelClick('bottom')} />
          <rect x="380" y="280" width="140" height="70" fill={panelFill('bottom', '#F7F3ED')} {...panelStroke('bottom', 2)} onClick={() => handlePanelClick('bottom')} />
        </g>
      );

    case 'cubeBox':
      // 1:1:1 Equilateral Cube Box (FEFCO 0201-CUBE)
      return (
        <g id="dieline-cube-box">
          {/* 4 Symmetrical Body Panels */}
          <rect x="40" y="130" width="110" height="140" fill={panelFill('left', '#FFFDFC')} {...panelStroke('left', 2)} onClick={() => handlePanelClick('left')} />
          <text x="95" y="205" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2B211B" pointerEvents="none">LEFT (1:1)</text>
          <line x1="150" y1="130" x2="150" y2="270" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          <rect x="150" y="130" width="110" height="140" fill={panelFill('front', '#FFFDFC')} {...panelStroke('front', 2)} onClick={() => handlePanelClick('front')} />
          <text x="205" y="205" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2B211B" pointerEvents="none">FRONT (1:1)</text>
          <line x1="260" y1="130" x2="260" y2="270" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          <rect x="260" y="130" width="110" height="140" fill={panelFill('right', '#FFFDFC')} {...panelStroke('right', 2)} onClick={() => handlePanelClick('right')} />
          <text x="315" y="205" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2B211B" pointerEvents="none">RIGHT (1:1)</text>
          <line x1="370" y1="130" x2="370" y2="270" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          <rect x="370" y="130" width="110" height="140" fill={panelFill('back', '#FFFDFC')} {...panelStroke('back', 2)} onClick={() => handlePanelClick('back')} />
          <text x="425" y="205" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2B211B" pointerEvents="none">BACK (1:1)</text>

          {/* Top Flaps Meeting at 50% width */}
          <line x1="40" y1="130" x2="480" y2="130" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <rect x="40" y="55" width="110" height="75" fill={panelFill('top', '#F7F3ED')} {...panelStroke('top', 2)} onClick={() => handlePanelClick('top')} />
          <rect x="150" y="55" width="110" height="75" fill={panelFill('top', '#F7F3ED')} {...panelStroke('top', 2)} onClick={() => handlePanelClick('top')} />
          <rect x="260" y="55" width="110" height="75" fill={panelFill('top', '#F7F3ED')} {...panelStroke('top', 2)} onClick={() => handlePanelClick('top')} />
          <rect x="370" y="55" width="110" height="75" fill={panelFill('top', '#F7F3ED')} {...panelStroke('top', 2)} onClick={() => handlePanelClick('top')} />
          <text x="260" y="95" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">EQUAL MEETING FLAPS (50% WIDTH)</text>

          {/* Bottom Flaps */}
          <line x1="40" y1="270" x2="480" y2="270" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <rect x="40" y="270" width="110" height="75" fill={panelFill('bottom', '#F7F3ED')} {...panelStroke('bottom', 2)} onClick={() => handlePanelClick('bottom')} />
          <rect x="150" y="270" width="110" height="75" fill={panelFill('bottom', '#F7F3ED')} {...panelStroke('bottom', 2)} onClick={() => handlePanelClick('bottom')} />
          <rect x="260" y="270" width="110" height="75" fill={panelFill('bottom', '#F7F3ED')} {...panelStroke('bottom', 2)} onClick={() => handlePanelClick('bottom')} />
          <rect x="370" y="270" width="110" height="75" fill={panelFill('bottom', '#F7F3ED')} {...panelStroke('bottom', 2)} onClick={() => handlePanelClick('bottom')} />

          {/* Glue Tab */}
          <polygon points="40,130 15,145 15,255 40,270" fill="#D97706" fillOpacity="0.4" stroke="#DC2626" strokeWidth="1.5" />
        </g>
      );

    case 'giftBox':
      // Luxury Gift Hamper Box with Ribbon Tie Slot (FEFCO 0427-LUX)
      return (
        <g id="dieline-gift-box">
          {/* Top Lid with Ribbon Slot */}
          <rect
            x="190" y="30" width="160" height="110"
            fill={panelFill('top', '#FFFDFC')}
            {...panelStroke('top', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('top')}
          />
          <rect x="200" y="40" width="140" height="90" fill="none" stroke="#A94F32" strokeWidth="1" strokeDasharray="3 3" pointerEvents="none" />
          <rect x="255" y="80" width="30" height="6" rx="3" fill="#D97706" stroke="#2B211B" strokeWidth="1" pointerEvents="none" />
          <text x="270" y="105" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A94F32" pointerEvents="none">
            RIBBON TIE SLIT
          </text>
          <line x1="190" y1="140" x2="350" y2="140" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Back Spine */}
          <rect
            x="190" y="140" width="160" height="50"
            fill={panelFill('back', '#F7F3ED')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="270" y="170" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">BACK WALL ({dep}″)</text>
          <line x1="190" y1="190" x2="350" y2="190" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Bottom Gift Bed */}
          <rect
            x="190" y="190" width="160" height="120"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="255" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            GIFT BED TRAY ({len}″×{wid}″)
          </text>
          <line x1="190" y1="310" x2="350" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Front Bevel Lip */}
          <rect
            x="190" y="310" width="160" height="50"
            fill={panelFill('front', '#F7F3ED')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <text x="270" y="340" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">FRONT BEVEL</text>

          {/* French Fold Flaps */}
          <rect
            x="80" y="190" width="110" height="120"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="190" y1="190" x2="190" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="135" y="255" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">LEFT FLAP</text>

          <rect
            x="350" y="190" width="110" height="120"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="350" y1="190" x2="350" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="405" y="255" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">RIGHT FLAP</text>
        </g>
      );

    case 'corporateBox':
      // Executive Corporate Welcome Kit Box (FEFCO 0427-CORP)
      return (
        <g id="dieline-corporate">
          {/* Magnetic Wrap-Around Flap */}
          <path
            d="M190,20 L350,20 Q370,50 350,80 L190,80 Z"
            fill={panelFill('lidFront', '#EADFD5')}
            {...panelStroke('lidFront', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('lidFront')}
          />
          <circle cx="330" cy="50" r="8" fill="#2B211B" stroke="#D97706" strokeWidth="2" pointerEvents="none" />
          <text x="260" y="55" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A94F32" pointerEvents="none">
            MAGNETIC FLAP WRAP
          </text>
          <line x1="190" y1="80" x2="350" y2="80" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Top Lid */}
          <rect
            x="190" y="80" width="160" height="90"
            fill={panelFill('top', '#FFFDFC')}
            {...panelStroke('top', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('top')}
          />
          <text x="270" y="130" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            WELCOME COVER
          </text>
          <line x1="190" y1="170" x2="350" y2="170" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Book Spine */}
          <rect
            x="190" y="170" width="160" height="40"
            fill={panelFill('back', '#F7F3ED')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="270" y="195" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">BOOK SPINE ({dep}″)</text>
          <line x1="190" y1="210" x2="350" y2="210" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Bottom Base */}
          <rect
            x="190" y="210" width="160" height="110"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="270" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            EXECUTIVE TRAY ({len}″×{wid}″)
          </text>
          <line x1="190" y1="320" x2="350" y2="320" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Front Wall */}
          <rect
            x="190" y="320" width="160" height="40"
            fill={panelFill('front', '#F7F3ED')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <circle cx="270" cy="340" r="8" fill="#2B211B" stroke="#D97706" strokeWidth="2" pointerEvents="none" />
          <text x="270" y="380" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#A94F32" pointerEvents="none">
            MAGNET INSERT
          </text>

          {/* Side Flaps */}
          <rect
            x="90" y="210" width="100" height="110"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="190" y1="210" x2="190" y2="320" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="140" y="270" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">LEFT</text>

          <rect
            x="350" y="210" width="100" height="110"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="350" y1="210" x2="350" y2="320" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="400" y="270" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">RIGHT</text>
        </g>
      );

    case 'foodRestaurant':
      // Fast-Food Clamshell Meal Box with Steam Vents & Tongue-Lock (FEFCO 0421-V)
      return (
        <g id="dieline-food-restaurant">
          {/* Top Lid with Steam Vents */}
          <rect
            x="180" y="30" width="180" height="100"
            fill={panelFill('top', '#FFFDFC')}
            {...panelStroke('top', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('top')}
          />
          {/* Triple Steam Vent Punches */}
          <circle cx="230" cy="80" r="6" fill="#A94F32" pointerEvents="none" />
          <circle cx="270" cy="80" r="6" fill="#A94F32" pointerEvents="none" />
          <circle cx="310" cy="80" r="6" fill="#A94F32" pointerEvents="none" />
          <text x="270" y="60" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A94F32" pointerEvents="none">STEAM VENTS</text>
          <text x="270" y="110" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            COMBO MEAL LID
          </text>
          <line x1="180" y1="130" x2="360" y2="130" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Back Wall */}
          <rect
            x="180" y="130" width="180" height="50"
            fill={panelFill('back', '#F7F3ED')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="270" y="160" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">BACK WALL ({dep}″)</text>
          <line x1="180" y1="180" x2="360" y2="180" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Bottom Meal Tray */}
          <rect
            x="180" y="180" width="180" height="110"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="240" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            BURGER & MEAL TRAY ({len}″×{wid}″)
          </text>
          <line x1="180" y1="290" x2="360" y2="290" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Front Wall with Locking Tongue */}
          <rect
            x="180" y="290" width="180" height="50"
            fill={panelFill('front', '#F7F3ED')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <path
            d="M250,340 L290,340 L280,365 L260,365 Z"
            fill={panelFill('lidFront', '#D97706')}
            fillOpacity={isInteractive ? 1 : 0.5}
            {...panelStroke('lidFront', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('lidFront')}
          />
          <text x="270" y="320" textAnchor="middle" fontSize="10" fill="#2B211B" pointerEvents="none">LOCKING TONGUE</text>

          {/* Side Web-Lock Wings */}
          <polygon
            points="180,180 180,290 90,270 90,200"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="180" y1="180" x2="180" y2="290" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          <polygon
            points="360,180 360,290 450,270 450,200"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="360" y1="180" x2="360" y2="290" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
        </g>
      );

    case 'pizzaBox':
      // Roll-Over Tuck-In Pizza Box (FEFCO 0426)
      return (
        <g id="dieline-pizza-box">
          {/* Top Lid */}
          <rect
            x="170" y="30" width="200" height="130"
            fill={panelFill('top', '#FFFDFC')}
            {...panelStroke('top', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('top')}
          />
          <text x="270" y="100" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            TOP PIZZA LID ({len}″×{wid}″)
          </text>
          <line x1="170" y1="160" x2="370" y2="160" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Back Hinge Wall */}
          <rect
            x="170" y="160" width="200" height="30"
            fill={panelFill('back', '#F7F3ED')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="270" y="180" textAnchor="middle" fontSize="9" fill="#6B584D" pointerEvents="none">BACK HINGE ({dep}″)</text>
          <line x1="170" y1="190" x2="370" y2="190" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Bottom Base Tray */}
          <rect
            x="170" y="190" width="200" height="130"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            PIZZA BASE TRAY
          </text>
          <line x1="170" y1="320" x2="370" y2="320" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Front Wall with Roll-Over Flaps */}
          <rect
            x="170" y="320" width="200" height="30"
            fill={panelFill('front', '#F7F3ED')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <polygon
            points="170,350 200,380 340,380 370,350"
            fill={panelFill('lidFront', '#EADFD5')}
            {...panelStroke('lidFront', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('lidFront')}
          />
          <text x="270" y="370" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A94F32" pointerEvents="none">
            FRONT ROLL LIP
          </text>

          {/* Double Roll-Over Side Walls */}
          <rect
            x="140" y="190" width="30" height="130"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="170" y1="190" x2="170" y2="320" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <rect x="100" y="190" width="40" height="130" fill="#EADFD5" stroke="#DC2626" strokeWidth="1.5" />

          <rect
            x="370" y="190" width="30" height="130"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="370" y1="190" x2="370" y2="320" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <rect x="400" y="190" width="40" height="130" fill="#EADFD5" stroke="#DC2626" strokeWidth="1.5" />
        </g>
      );

    case 'flatBox':
      // Low Profile Document & Bookfold Folder (FEFCO 0401)
      return (
        <g id="dieline-flat-folder">
          {/* Base Document Bed */}
          <rect
            x="180" y="150" width="180" height="140"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="225" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            DOCUMENT BED ({len}″×{wid}″)
          </text>

          {/* Top Wrap Wing */}
          <polygon
            points="180,150 200,50 340,50 360,150"
            fill={panelFill('top', '#F7F3ED')}
            {...panelStroke('top', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('top')}
          />
          <line x1="180" y1="150" x2="360" y2="150" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="270" y="105" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            TOP WRAP WING
          </text>

          {/* Bottom Wrap Wing */}
          <polygon
            points="180,290 200,390 340,390 360,290"
            fill={panelFill('front', '#F7F3ED')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <line x1="180" y1="290" x2="360" y2="290" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="270" y="345" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            BOTTOM WRAP WING
          </text>

          {/* Left Wing */}
          <polygon
            points="180,150 70,170 70,270 180,290"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="180" y1="150" x2="180" y2="290" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="125" y="225" textAnchor="middle" fontSize="9" fill="#2B211B" pointerEvents="none">LEFT WING</text>

          {/* Right Wing */}
          <polygon
            points="360,150 470,170 470,270 360,290"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="360" y1="150" x2="360" y2="290" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="415" y="225" textAnchor="middle" fontSize="9" fill="#2B211B" pointerEvents="none">RIGHT WING</text>
        </g>
      );

    case 'apparelBox':
      // Wide Apparel & Garment Chest with Collar Aperture (FEFCO 0422-A)
      return (
        <g id="dieline-apparel">
          {/* Top Garment Cover */}
          <rect
            x="160" y="30" width="220" height="120"
            fill={panelFill('top', '#FFFDFC')}
            {...panelStroke('top', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('top')}
          />
          <path d="M230,150 Q270,135 310,150 Z" fill="#EADFD5" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3 3" pointerEvents="none" />
          <text x="270" y="90" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            GARMENT DISPLAY COVER
          </text>
          <line x1="160" y1="150" x2="380" y2="150" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Back Spine */}
          <rect
            x="160" y="150" width="220" height="40"
            fill={panelFill('back', '#F7F3ED')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="270" y="175" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">BACK SPINE ({dep}″)</text>
          <line x1="160" y1="190" x2="380" y2="190" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Base Apparel Tray */}
          <rect
            x="160" y="190" width="220" height="120"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="255" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            SUIT & SHIRT BED ({len}″×{wid}″)
          </text>
          <line x1="160" y1="310" x2="380" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Front Wall with Collar-Safe Tuck Lip */}
          <rect
            x="160" y="310" width="220" height="40"
            fill={panelFill('front', '#F7F3ED')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <polygon
            points="160,350 180,380 360,380 380,350"
            fill={panelFill('lidFront', '#EADFD5')}
            {...panelStroke('lidFront', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('lidFront')}
          />
          <text x="270" y="370" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A94F32" pointerEvents="none">
            COLLAR-SAFE TUCK LIP
          </text>

          {/* Left & Right Flaps */}
          <rect
            x="70" y="190" width="90" height="120"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="160" y1="190" x2="160" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="115" y="255" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">LEFT FLAP</text>

          <rect
            x="380" y="190" width="90" height="120"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="380" y1="190" x2="380" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="425" y="255" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">RIGHT FLAP</text>
        </g>
      );

    case 'foodPackaging':
      // Takeout Food Platter Box with Window & Web-Locks (FEFCO 0421-FP)
      return (
        <g id="dieline-food-pkg">
          {/* Top Platter Cover */}
          <rect
            x="170" y="30" width="200" height="100"
            fill={panelFill('top', '#FFFDFC')}
            {...panelStroke('top', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('top')}
          />
          <rect x="210" y="55" width="120" height="50" rx="6" fill="#EEF5FF" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3 2" pointerEvents="none" />
          <text x="270" y="85" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2563EB" pointerEvents="none">
            VIEWING WINDOW
          </text>
          <line x1="170" y1="130" x2="370" y2="130" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Back Wall */}
          <rect
            x="170" y="130" width="200" height="60"
            fill={panelFill('back', '#F7F3ED')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="270" y="165" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">BACK HINGE ({dep}″)</text>
          <line x1="170" y1="190" x2="370" y2="190" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Bottom Platter Base */}
          <rect
            x="170" y="190" width="200" height="110"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="250" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            FOOD PLATTER BASE ({len}″×{wid}″)
          </text>
          <line x1="170" y1="300" x2="370" y2="300" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* Front Wall */}
          <rect
            x="170" y="300" width="200" height="60"
            fill={panelFill('front', '#F7F3ED')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <text x="270" y="335" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">FRONT WALL</text>

          {/* Left & Right Wings with Web-Locks */}
          <polygon
            points="170,190 170,300 80,280 80,210"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="170" y1="190" x2="170" y2="300" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="125" y="250" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A94F32" pointerEvents="none">WEB LOCK</text>

          <polygon
            points="370,190 370,300 460,280 460,210"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="370" y1="190" x2="370" y2="300" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="415" y="250" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A94F32" pointerEvents="none">WEB LOCK</text>
        </g>
      );

    case 'carton':
      // Universal Logistics Shipping Carton (FEFCO 0201 RSC)
      return (
        <g id="dieline-carton">
          {/* Top Meeting Flaps */}
          <rect x="60" y="30" width="90" height="70" fill={panelFill('top', '#F7F3ED')} {...panelStroke('top', 2)} onClick={() => handlePanelClick('top')} />
          <rect x="150" y="30" width="120" height="70" fill={panelFill('top', '#F7F3ED')} {...panelStroke('top', 2)} onClick={() => handlePanelClick('top')} />
          <rect x="270" y="30" width="90" height="70" fill={panelFill('top', '#F7F3ED')} {...panelStroke('top', 2)} onClick={() => handlePanelClick('top')} />
          <rect x="360" y="30" width="120" height="70" fill={panelFill('top', '#F7F3ED')} {...panelStroke('top', 2)} onClick={() => handlePanelClick('top')} />
          <line x1="60" y1="100" x2="480" y2="100" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />

          {/* 4 Vertical Panels */}
          <rect
            x="60" y="100" width="90" height="170"
            fill={panelFill('left', '#FFFDFC')}
            {...panelStroke('left', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <text x="105" y="190" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">LEFT ({wid}″)</text>

          <rect
            x="150" y="100" width="120" height="170"
            fill={panelFill('front', '#FFFDFC')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <text x="210" y="190" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            FRONT ({len}″)
          </text>

          <rect
            x="270" y="100" width="90" height="170"
            fill={panelFill('right', '#FFFDFC')}
            {...panelStroke('right', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <text x="315" y="190" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">RIGHT ({wid}″)</text>

          <rect
            x="360" y="100" width="120" height="170"
            fill={panelFill('back', '#FFFDFC')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="420" y="190" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            BACK ({len}″)
          </text>

          {/* Glue Tab */}
          <polygon points="60,100 35,115 35,255 60,270" fill="#D97706" fillOpacity="0.4" stroke="#DC2626" strokeWidth="1.5" />
          <text x="48" y="190" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#D97706" transform="rotate(-90, 48, 190)" pointerEvents="none">
            GLUE TAB
          </text>

          {/* Bottom Meeting Flaps */}
          <line x1="60" y1="270" x2="480" y2="270" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <rect x="60" y="270" width="90" height="70" fill={panelFill('bottom', '#F7F3ED')} {...panelStroke('bottom', 2)} onClick={() => handlePanelClick('bottom')} />
          <rect x="150" y="270" width="120" height="70" fill={panelFill('bottom', '#F7F3ED')} {...panelStroke('bottom', 2)} onClick={() => handlePanelClick('bottom')} />
          <rect x="270" y="270" width="90" height="70" fill={panelFill('bottom', '#F7F3ED')} {...panelStroke('bottom', 2)} onClick={() => handlePanelClick('bottom')} />
          <rect x="360" y="270" width="120" height="70" fill={panelFill('bottom', '#F7F3ED')} {...panelStroke('bottom', 2)} onClick={() => handlePanelClick('bottom')} />
        </g>
      );

    case 'mailerBox':
    default:
      // Standard Roll-End Tuck-Top (RETT) Mailer Box (FEFCO 0427)
      return (
        <g id="dieline-mailer-rett">
          {/* Top Lid with Locking Ears */}
          <rect
            x="190" y="40" width="160" height="100"
            fill={panelFill('top', '#FFFDFC')}
            {...panelStroke('top', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('top')}
          />
          <text x="270" y="95" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            TOP COVER LID ({len}″×{wid}″)
          </text>

          {/* Front Tuck Flap with Angled Ears */}
          <path
            d="M190,40 L165,15 L375,15 L350,40 Z"
            fill={panelFill('lidFront', '#EADFD5')}
            {...panelStroke('lidFront', 1.5)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('lidFront')}
          />
          <line x1="190" y1="40" x2="350" y2="40" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="270" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#A94F32" pointerEvents="none">
            TUCK FLAP (LOCKING EARS)
          </text>

          {/* Back Wall */}
          <line x1="190" y1="140" x2="350" y2="140" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <rect
            x="190" y="140" width="160" height="50"
            fill={panelFill('back', '#F7F3ED')}
            {...panelStroke('back', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('back')}
          />
          <text x="270" y="170" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">BACK WALL ({dep}″)</text>

          {/* Bottom Tray Base */}
          <line x1="190" y1="190" x2="350" y2="190" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <rect
            x="190" y="190" width="160" height="120"
            fill={panelFill('bottom', '#FFFDFC')}
            {...panelStroke('bottom', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('bottom')}
          />
          <text x="270" y="255" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2B211B" pointerEvents="none">
            BOTTOM BASE TRAY
          </text>

          {/* Front Roll Wall */}
          <line x1="190" y1="310" x2="350" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <rect
            x="190" y="310" width="160" height="50"
            fill={panelFill('front', '#F7F3ED')}
            {...panelStroke('front', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('front')}
          />
          <text x="270" y="340" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">FRONT ROLL WALL</text>

          {/* Left Double Roll-Over Wall with Cherry Locks */}
          <rect
            x="80" y="190" width="110" height="120"
            fill={panelFill('left', '#F7F3ED')}
            {...panelStroke('left', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('left')}
          />
          <line x1="190" y1="190" x2="190" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="135" y="255" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">LEFT ROLL-OVER</text>

          {/* Right Double Roll-Over Wall with Cherry Locks */}
          <rect
            x="350" y="190" width="110" height="120"
            fill={panelFill('right', '#F7F3ED')}
            {...panelStroke('right', 2)}
            className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
            onClick={() => handlePanelClick('right')}
          />
          <line x1="350" y1="190" x2="350" y2="310" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 3" />
          <text x="405" y="255" textAnchor="middle" fontSize="10" fill="#6B584D" pointerEvents="none">RIGHT ROLL-OVER</text>
        </g>
      );
  }
}
