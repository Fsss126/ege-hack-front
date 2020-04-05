import {RouteComponentProps} from "react-router";

export interface RouteComponentPropsWithPath<Params extends { [K in keyof Params]?: string } = {}> extends RouteComponentProps<Params> {
    path: string;
}
