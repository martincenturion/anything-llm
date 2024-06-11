import React from "react";
import DefaultBadge from "../DefaultBadge";

export default function DefaultSkill({ title, description, image, icon }) {
  return (
    <div className="p-2">
      <div className="flex flex-col gap-y-[18px] max-w-[500px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-x-2">
            {icon &&
              React.createElement(icon, {
                size: 24,
                color: "white",
                weight: "bold",
              })}
            <label htmlFor="name" className="text-white text-md font-bold">
              {title}
            </label>
            <DefaultBadge title={title} />
          </div>
        </div>
        <img src={image} alt={title} className="w-full rounded-md" />
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {description}
        </p>
      </div>
    </div>
  );
}
