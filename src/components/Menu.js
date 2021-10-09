import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faClipboard, faFileExport, faHistory, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { exportSave, importSave } from '../saveload.js';

const MenuContainer = styled.div`
  position: absolute;
  right: calc(var(--w) / 100 * 3);
  bottom: calc(var(--h) / 100 * 3);
  
  text-align: right;

  z-index: 2;
`;
const MenuOpen = styled.div`
  border-radius: 50%;
  background-color: var(--colMain4);
  box-shadow: var(--baseShadow);

  margin-left: auto; /** Self right align */
  width: calc(var(--baseSize) / 25);

  cursor: pointer;

  transition:
    transform 0.5s cubic-bezier(0,.75,.21,1),
    background-color 0.3s cubic-bezier(0,.75,.21,1);

  &:hover {
    transform: scale(1.1);
  }
  &:active {
    transform: scale(1);
    background-color: var(--colAlt1);

    transition:
      transform 0.5s cubic-bezier(0,.75,.21,1),
      background-color 0s cubic-bezier(0,.75,.21,1);
  }
`;
const MenuList = styled.div`
  padding: 3%;

  width: calc(var(--baseSize) / 10);

  backdrop-filter: blur(calc(var(--baseSize) / 1000));

  z-index: 1;

  & > div:not(::last-child) {
    margin-bottom: calc(var(--h) / 100);
  }
`;
const MenuItemAppear = keyframes`
  from {
    opacity: 0;
    transform: translateX(150%);
  }
  30% {
    opacity: 0;
    transform: translateX(150%);
  }
  to {
    opacity: 1;
    transform: translateX(0%);
  }
`;
const MenuItem = styled.div`
  --itemHeight: calc(var(--h) / 45);
  --gradientCol: var(--colMain4);

  width: 100%;

  padding: calc(var(--itemHeight) / 5);
  margin: calc(var(--itemHeight) / 3);

  border-radius: calc(var(--itemHeight) / 3);
  background: linear-gradient(
    to left,
    var(--gradientCol) 0%,
    rgba(0, 0, 0, 0) 70%
  );

  display: flex;
  justify-content: space-evenly;
  align-items: center;

  animation: ${MenuItemAppear} 0.4s cubic-bezier(.11,.94,.37,.99);
  cursor: pointer;
  transition:
    width 0.4s cubic-bezier(.11,.94,.37,.99),
    background-size 0.4s cubic-bezier(.11,.94,.37,.99),
    transform 0.4s cubic-bezier(.11,.94,.37,.99),
    color 0.4s cubic-bezier(.11,.94,.37,.99);

  &:hover {
    --gradientCol: var(--colAlt1);

    width: 120%;
    transform: translateX(calc(-20% / 1.2));
    background-size: 200%;
    color: var(--colAlt1);
  }
`;
const MentItemTitile = styled.span`
  font-size: var(--itemHeight);
  font-weight: bold;
`;
/** const OverlayBg = styled.div`
  position: absolute;
  left: 0;
  top: 0;

  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: var(--colOverlayReverse);

  z-index: 9999;
`;
const OverlayClose = styled.div`
  position: absolute;
  right: calc(var(--baseSize) / 40);
  top: calc(var(--baseSize) / 40);

  width: calc(var(--baseSize) / 20);
  height: calc(var(--baseSize) / 20);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  font-size: calc(var(--baseSize) / 25);
  font-weight: bold;

  background-color: var(--colMain4);
  border-radius: 50%;

  cursor: pointer;

  transition: transform 0.3s cubic-bezier(0,.91,1,1.27);

  &:hover {
    transform: rotate(90deg);
  }
`;
const OverlayWindow = styled.div`
  
`; */

const MENU_LIST = [
  {
    title: "Export",
    icon: faFileExport,
    func: () => navigator.clipboard.writeText(exportSave()) && window.alert("Exported to clipboard!")
  },
  {
    title: "Import",
    icon: faClipboard,
    func: () => importSave(window.prompt("Import Save"))
  },
  {
    title: "Recover",
    icon: faHistory,
    func: () => alert("TBA!")
  }
];

function Menu() {
  const [menuToggle, setMenuToggle] = useState(false);
  // const [overlayState, setOverlayState] = useState(null);

  return (
    <>
      <MenuContainer>
        {menuToggle && (
          <MenuList>
          {
            MENU_LIST.map((item, idx) => (
              <MenuItem
                key={item.title}
                data-animation-offset={idx}
                onClick={() => item.func()}
                style={{
                  animationDuration: (200*(idx+1)) + "ms"
                }}
              >
                <FontAwesomeIcon 
                  icon={item.icon}
                  style={{
                    width: "var(--itemHeight)", 
                    height: "var(--itemHeight)"
                  }}
                />
                <MentItemTitile>{item.title}</MentItemTitile>
              </MenuItem>
            ))
          }
          </MenuList>
        )}
        <MenuOpen
          onClick={() => setMenuToggle(!menuToggle)}
          style={menuToggle ? {backgroundColor: "var(--colAlt1)"} : {}}
        >
          <FontAwesomeIcon
            icon={faBars}
            style={{
              width: "calc(var(--baseSize) / 25)",
              height: "calc(var(--baseSize) / 25)",

              color: "var(--colReverse)",
              transform: "scale(0.4)"
            }}
          />
        </MenuOpen>
      </MenuContainer>
      {/* {overlayState && (
        <OverlayBg>
          <OverlayClose
            onClick={() => setOverlayState(null)}
          >
            ×
          </OverlayClose>
        </OverlayBg>
      )} */}
    </>
  )
}

export default Menu;
