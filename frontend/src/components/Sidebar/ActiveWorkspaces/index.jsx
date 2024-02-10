import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Workspace from "@/models/workspace";
import ManageWorkspace, {
  useManageWorkspaceModal,
} from "../../Modals/MangeWorkspace";
import paths from "@/utils/paths";
import { useParams } from "react-router-dom";
import { GearSix, SquaresFour } from "@phosphor-icons/react";
import truncate from "truncate";
import useUser from "@/hooks/useUser";
import ThreadContainer from "./ThreadContainer";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ActiveWorkspaces() {
  const { slug } = useParams();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [settingHover, setSettingHover] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWs, setSelectedWs] = useState(null);
  const [hoverStates, setHoverStates] = useState({});
  const { showing, showModal, hideModal } = useManageWorkspaceModal();

  useEffect(() => {
    async function getWorkspaces() {
      const workspaces = await Workspace.all();
      setLoading(false);
      setWorkspaces(workspaces);
    }
    getWorkspaces();
  }, [slug]);

  const handleMouseEnter = useCallback((workspaceId) => {
    setHoverStates((prev) => ({ ...prev, [workspaceId]: true }));
  }, []);

  const handleMouseLeave = useCallback((workspaceId) => {
    setHoverStates((prev) => ({ ...prev, [workspaceId]: false }));
  }, []);

  const handleGearMouseEnter = useCallback((workspaceId) => {
    setSettingHover((prev) => ({ ...prev, [workspaceId]: true }));
  }, []);

  const handleGearMouseLeave = useCallback((workspaceId) => {
    setSettingHover((prev) => ({ ...prev, [workspaceId]: false }));
  }, []);

  if (loading) {
    return (
      <>
        <Skeleton.default
          height={36}
          width="100%"
          count={3}
          baseColor="#292524"
          highlightColor="#4c4948"
          enableAnimation={true}
        />
      </>
    );
  }

  return (
    <>
      {workspaces.map((workspace) => {
        const isActive = workspace.slug === slug;
        const isHovered = hoverStates[workspace.id];
        const isGearHovered = settingHover[workspace.id];

        return (
          <div key={workspace.id} className="flex flex-col w-full">
            <div
              className="flex gap-x-2 items-center justify-between"
              onMouseEnter={() => handleMouseEnter(workspace.id)}
              onMouseLeave={() => handleMouseLeave(workspace.id)}
            >
              <Link
                to={isActive ? null : paths.workspace.chat(workspace.slug)}
                className={`
              transition-all duration-[200ms]
            flex flex-grow w-[75%] gap-x-2 py-[6px] px-[12px] rounded-lg text-slate-200 justify-start items-center border
            hover:bg-workspace-item-selected-gradient hover:border-slate-100 hover:border-opacity-50
            ${
              isActive
                ? "bg-workspace-item-selected-gradient border-slate-100 border-opacity-50"
                : "bg-workspace-item-gradient bg-opacity-60 border-transparent"
            }`}
              >
                <div className="flex flex-row justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <SquaresFour
                      weight={isActive ? "fill" : "regular"}
                      className="h-5 w-5 flex-shrink-0"
                    />
                    <p
                      className={`text-white text-sm leading-loose font-medium whitespace-nowrap overflow-hidden ${
                        isActive ? "" : "text-opacity-80"
                      }`}
                    >
                      {isActive
                        ? truncate(workspace.name, 17)
                        : truncate(workspace.name, 20)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedWs(workspace);
                      showModal();
                    }}
                    onMouseEnter={() => handleGearMouseEnter(workspace.id)}
                    onMouseLeave={() => handleGearMouseLeave(workspace.id)}
                    className="border-none rounded-md flex items-center justify-center text-white ml-auto"
                  >
                    <GearSix
                      weight={isGearHovered ? "fill" : "regular"}
                      hidden={
                        (!isActive && !isHovered) || user?.role === "default"
                      }
                      className="h-[20px] w-[20px] transition-all duration-300"
                    />
                  </button>
                </div>
              </Link>
            </div>
            {isActive && (
              <ThreadContainer workspace={workspace} isActive={isActive} />
            )}
          </div>
        );
      })}
      {showing && (
        <ManageWorkspace
          hideModal={hideModal}
          providedSlug={selectedWs ? selectedWs.slug : null}
        />
      )}
    </>
  );
}
