import { NavigationScreenConfigProps } from "react-navigation";
import { ReactNode } from "react";
import { WithNamespaces } from "react-i18next";

export interface ComponentProps {
    children?: ReactNode; // Means any View can be passed in as children for another View
}

export type ComponentInputPropsDefault = ComponentProps & NavigationScreenConfigProps & WithNamespaces;
