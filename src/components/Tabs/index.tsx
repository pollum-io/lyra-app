import React, { useState, ReactNode } from "react";

interface TabProps {
  title: string;
  children: ReactNode;
}

export const TabContent: React.FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};

interface TabsProps {
  children: React.ReactElement<TabProps>[] | React.ReactElement<TabProps>;
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  let tabs = Array.isArray(children) ? children : [children];

  return (
    <div>
      <div className="flex h-full w-full justify-center">
        {tabs.map((child, index) => (
          <button
            key={index}
            className={`h-[40px] w-[120px] rounded-lg px-4 py-2 ${
              index === activeTab ? "bg-brandBlue-300" : "text-gray-300"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {child.props.title}
          </button>
        ))}
      </div>
      <div className="flex h-full w-full flex-col justify-between">
        {tabs[activeTab]}
      </div>
    </div>
  );
};

export default Tabs;
