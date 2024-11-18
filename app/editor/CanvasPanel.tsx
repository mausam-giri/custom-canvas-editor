import { useState } from "react";
import { FabricObject } from "fabric";

import LayersPanel from "./panels/LayersPanel";
import SettingsPanel from "./panels/SettingsPanel";
import CanvasSettings from "./settings/CanvasSettings";

const TABS = {
  Settings: 1,
  Layers: 2,
} as const;

type TabKeys = keyof typeof TABS;
type ActiveTab = (typeof TABS)[TabKeys];

export default function CanvasPanel(props: {
  activeObject: FabricObject | null;
}) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(TABS.Settings);

  const renderTabs = () => {
    return (Object.keys(TABS) as TabKeys[]).map((tab) => (
      <div
        key={tab}
        className={`py-2 px-2 text-sm font-bold text-center cursor-pointer  ${
          activeTab === TABS[tab]
            ? "text-blue-500 bg-blue-100"
            : "text-black bg-white hover:bg-blue-50"
        }`}
        onClick={() => setActiveTab(TABS[tab])}
        role="tab"
        aria-selected={activeTab === TABS[tab]}
      >
        {tab}
      </div>
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.Settings:
        return props.activeObject ? (
          <SettingsPanel activeObject={props.activeObject} />
        ) : (
          <CanvasSettings />
        );
      case TABS.Layers:
        return <LayersPanel />;
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-2 border-b">{renderTabs()}</div>
        <div className="p-3">{renderContent()}</div>
      </div>
    </>
  );
}
