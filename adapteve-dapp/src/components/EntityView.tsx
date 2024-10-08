import React, { useEffect } from "react";

import {
  useSmartObject,
  useNotification,
  useConnection,
} from "@eveworld/contexts";
import { Severity } from "@eveworld/types";
import {
  SmartAssemblyInfo,
  EveLoadingAnimation,
  ClickToCopy,
  ErrorNotice,
  ErrorNoticeTypes,
} from "@eveworld/ui-components";
import { abbreviateAddress } from "@eveworld/utils";
import { defaultDescriptions } from "@eveworld/utils/consts";

import EquippedModules from "./Modules";
import SmartAssemblyActions from "./SmartAssemblyActions";
import SmartGateImage from "../assets/smart-gate.png";
import SmartStorageUnitImage from "../assets/smart-storage-unit.png";
import SmartTurretImage from "../assets/smart-turret.png";

const EntityView = React.memo((): JSX.Element => {
  const { defaultNetwork, gatewayConfig } = useConnection();
  const { smartAssembly, smartCharacter, loading } = useSmartObject();
  const { notify, handleClose } = useNotification();

  useEffect(() => {
    if (loading) {
      notify({ type: Severity.Info, message: "Loading..." });
    } else {
      handleClose();
    }
  }, [loading]);

  if ((!loading && !smartAssembly) || !smartAssembly?.isValid) {
    return <ErrorNotice type={ErrorNoticeTypes.SMART_ASSEMBLY} />;
  }

  const defaultImages: Record<string, string> = {
    SmartStorageUnit: SmartStorageUnitImage,
    SmartTurret: SmartTurretImage,
    SmartGate: SmartGateImage,
  };

  return (
    <EveLoadingAnimation position="diagonal">
      <div className="grid border border-brightquantum bg-crude">
        <div
          className="flex flex-col align-center border border-brightquantum"
          id="smartassembly-name"
        >
          <div className="bg-brightquantum text-crude flex items-stretch justify-between px-2 py-1 font-semibold">
            <span className="uppercase">{smartAssembly?.name}</span>
            <span className="flex flex-row items-center">
              {abbreviateAddress(smartAssembly?.id)}
              <ClickToCopy
                text={smartAssembly?.id}
                className="text-crude"
              />{" "}
            </span>
          </div>
          <img
            src={defaultImages[smartAssembly.assemblyType]}
            id="smartassembly-image"
          />
          <SmartAssemblyActions />

          <div className="Quantum-Container Title">Description</div>
          <div
            className="Quantum-Container font-normal text-xs !py-4"
            id="smartassembly-description"
          >
            {smartAssembly.description
              ? smartAssembly.description
              : defaultDescriptions[smartAssembly.assemblyType]}
          </div>
        </div>

        <div className="grid grid-cols-2 mobile:grid-cols-1 bg-crude">
          <div className="contents empty-span-full">
            <SmartAssemblyInfo
              smartAssembly={smartAssembly}
              smartCharacter={smartCharacter}
              defaultNetwork={defaultNetwork}
              gatewayConfig={gatewayConfig}
            />
          </div>
          <EquippedModules />
        </div>
      </div>
    </EveLoadingAnimation>
  );
});

export default React.memo(EntityView);
