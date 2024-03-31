"use client";

import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import type { Session } from "next-auth";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { ButtonLoading } from "~/components/buttonLoading";

type Prop = {
  session: Session | null;
};
export const CreatePostWizard = ({ session }: Prop) => {
  if (session === null || session?.user == null) return null;
  const user = session?.user;
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const { mutate, isPending } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast({
          description: `Error: ${errorMessage[0]}`,
          variant: "destructive",
        });
      } else {
        toast({
          description: `Error: try again later`,
          variant: "destructive",
        });
      }
    },
  });
  return (
    <div className="flex w-full gap-4">
      {/* <Image
        src={user.image as string}
        alt="Profile image"
        className="h-12 w-12 rounded-full"
        width={56}
        height={56}
      /> */}
      <input
        placeholder="Type a message!"
        className=" grow bg-transparent text-xl outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {isPending ? (
        <ButtonLoading> Please Wait </ButtonLoading>
      ) : (
        <Button
          onClick={() => mutate({ content: input })}
          disabled={input === ""}
        >
          Submit
        </Button>
      )}
    </div>
  );
};
