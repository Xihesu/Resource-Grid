import { useState } from 'react';
import { connect, useSelector } from "react-redux";
import { craftStart, toggleAuto } from "../../modules/resources.js";
import styled, { keyframes } from 'styled-components';
import notation from "../../util/notation.js";
import { AutoConnected } from "../../data/resources.js";
// eslint-disable-next-line
import Resource from '../../class/Resource';
import ResourceImage from "./ResourceImage";
import ResourceCost from "./ResourceCost.js";
import ResourceAutomate from './ResourceAutomates.js';
import ResourceRandomTable from "./ResourceRandom.js";
import ResoruceProduction from './ResourceProduction.js';

const namespaceAppear = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%) scale(0.2, 1);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1, 1);
  }
`;
const ResourceWarp = styled.div`
  --margin: calc(var(--cellSize) / 10);
  --boxRatio: 1.3;
  --boxSize: calc(var(--cellSize) - var(--margin));
  --cellWidth: calc(var(--boxSize) / var(--boxRatio));
  --cellHeight: var(--boxSize);
  --borderRadius: calc(var(--boxSize) / 15);

  margin: calc(var(--margin) / 2);

  width: var(--cellWidth);
  height: var(--cellHeight);
  
  background-color: var(--colMain3);
  border-radius: var(--borderRadius);
  box-shadow: var(--baseShadow);

  transform: scale(1);
  cursor: pointer;

  transition: all 0.3s cubic-bezier(0,.79,.32,1);

  &:hover {
    width: calc(var(--boxSize) / var(--boxRatio) * 2);
    background-color: var(--colMain4);
    transform: scale(1.4);
    z-index: 1;
  }

  &:hover::before {
    content: attr(name);

    padding: 1% 5%;
    
    min-width: 60%;
    height: 15%;

    position: absolute;
    top: -15%;
    left: 5%;

    color: var(--colMainReverse);
    word-spacing: -0.3em;
    font-size: 0.9em;
    text-align: center;

    background-color: var(--colMain4);
    border-radius: calc(var(--cellSize) / 30);

    animation: ${namespaceAppear} 0.4s cubic-bezier(.12,.81,.31,.95);
    
    pointer-events: none;
  }
`;
const ResourceInfo = styled.div`
  display: flex;
  overflow: hidden;
  
  & > span {
    display: inline-block;

    width: calc(var(--boxSize) / var(--boxRatio));
    height: calc(var(--boxSize));
  }
`;
const ResourceProgress = styled.span`
  position: absolute;
  bottom: 0;

  width: 100%;
  height: 0%;
  max-height: 100%;

  background-color: var(--colOverlay);
  border-radius: var(--borderRadius);

  z-index: -1;
`;
const ResourceQuantity = styled.div`
  padding-right: calc(var(--boxSize) / 20);

  text-align: right;
  font-weight: bolder;
  color: var(--colReverse);
`;

/**
 * @param {object} obj
 * @param {Resource} obj.data 
 */
function ResourceGridItem({ Resource, index, craftStart, autoToggleMode, toggleAuto }) {
  const [isHover, setHover] = useState(false);

  const displayName = Resource ? Resource.name.replace(/(.)([A-Z])/g, `$1 $2`) : "";
  const save = useSelector(state => state.resources[index]);
  const cost = Resource ? Object.entries(Resource.cost(save.have) ?? {}) : [];
  const autoConnected = AutoConnected[index];

  const displayResource = save.unlocked && (!autoToggleMode || autoConnected !== -1);

  return (
    <ResourceWarp
      onClick={() => {
        if (autoToggleMode) {
          toggleAuto(index);
        } else if (Resource && Object.keys(Resource.cost(save.have) ?? {}).length !== 0) {
          craftStart(index);
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      name={displayName}
      style={{
        backgroundColor: (save.automationDisabled || (autoToggleMode && displayResource)) ?
          (!save.automationDisabled ? "#1c5412" : "#541212" ) :
          undefined,
        opacity: displayResource ? undefined : 0.3,
        pointerEvents: displayResource ? undefined: "none"
      }}
    >
      {
        (displayResource && Resource) &&
        <ResourceInfo>
          <span>
            <ResourceImage
              size="calc(var(--boxSize) / var(--boxRatio) - var(--margin))"
              position={Resource.position}
              style={{filter: "drop-shadow(var(--baseShadow))", margin: "calc(var(--margin) / 2)"}}
            />
            <ResourceQuantity>
              {notation(save.have)}
            </ResourceQuantity>
            <ResourceProgress style={{height: `${save.progress * 100}%`}}/>
          </span>
          {
            isHover &&
            <>
              <ResourceCost cost={cost}/>
              <ResourceRandomTable Resource={Resource}/>
              <ResourceAutomate Resource={Resource}/>
              <ResoruceProduction Resource={Resource} autoConnected={autoConnected}/>
            </>
          }
        </ResourceInfo>
      }
    </ResourceWarp>
  );
}

export default connect(
  () => ({}),
  {
    craftStart,
    toggleAuto,
  }
)(ResourceGridItem);
