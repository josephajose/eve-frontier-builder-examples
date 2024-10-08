import { Outlet } from "react-router-dom";

import "./App.css";

import {
  useNotification,
  useConnection,
  useSmartObject,
} from "@eveworld/contexts";
import {
  EveConnectWallet,
  EveFeralCodeGen,
  ErrorNotice,
  ErrorNoticeTypes,
  EveLayout,
  EveAlert,
} from "@eveworld/ui-components";

const App = () => {
  const {
    connectedProvider,
    publicClient,
    walletClient,
    isCurrentChain,
    handleConnect,
    handleDisconnect,
    availableWallets,
    defaultNetwork,
  } = useConnection();
  const { notification } = useNotification();
  const { loading, smartAssembly, smartCharacter } = useSmartObject();

  const { connected } = connectedProvider;

  if (!connected || !publicClient || !walletClient) {
    return (
      <div className="h-full w-full bg-crude-5 -z-10">
        <EveConnectWallet
          handleConnect={handleConnect}
          availableWallets={availableWallets}
        />
        <GenerateEveFeralCodeGen style="top-12" />
        <GenerateEveFeralCodeGen style="bottom-12" />
      </div>
    );
  }

  return (
    <>
      <EveAlert
        defaultNetwork={defaultNetwork}
        message={notification.message}
        txHash={notification.txHash}
        severity={notification.severity}
        handleClose={notification.handleClose}
        isOpen={notification.isOpen}
        isStyled={false}
      />

      <EveLayout
        isCurrentChain={isCurrentChain}
        connected={connectedProvider.connected}
        handleDisconnect={handleDisconnect}
        walletClient={walletClient}
        smartCharacter={smartCharacter}
      >
        {isCurrentChain ? (
          <Outlet />
        ) : (
          <ErrorNotice
            loading={loading}
            smartAssembly={smartAssembly}
            type={ErrorNoticeTypes.MESSAGE}
            errorMessage={`Switch network to ${walletClient.chain?.name} to continue`}
          />
        )}
      </EveLayout>
      <GenerateEveFeralCodeGen style="bottom-12 text-xs -z-10" />
    </>
  );
};

export default App;

const GenerateEveFeralCodeGen = ({
  style,
  count = 5,
}: {
  style?: string;
  count?: number;
}) => {
  const codes = Array.from({ length: count }, (_, i) => i);
  return (
    <div
      className={`absolute flex justify-between px-10 justify-items-center w-full text-xs ${style}`}
    >
      {codes.map((index) => (
        <EveFeralCodeGen key={index} />
      ))}{" "}
    </div>
  );
};
