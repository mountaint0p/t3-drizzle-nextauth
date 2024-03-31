import { Children, PropsWithChildren } from "react";
import { LoadingSpinner } from "./loading";

import { Button } from "~/components/ui/button";

export const ButtonLoading = (props: PropsWithChildren) => {
  return (
    <Button disabled className="flex gap-1">
      <LoadingSpinner size={15} />
      {props.children}
    </Button>
  );
};
