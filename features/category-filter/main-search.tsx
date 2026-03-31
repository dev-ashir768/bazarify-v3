import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MainSearch = () => {
  return (
    <>
      <div
        className="w-[90%] md:w-[60%] h-16 mx-auto bg-background rounded-full flex justify-center items-center py-3 pl-8 pr-3 mb-1"
        style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
      >
        <Input
          type="text"
          placeholder="What are you shopping for today?"
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base! placeholder:text-base py-0 pl-0 pr-6"
        />

        <Button className="size-12 [&_svg:not([class*='size-'])]:size-6 rounded-full" size="icon-lg">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M27 27L20.7268 20.7268M20.7268 20.7268C21.7999 19.6538 22.6511 18.3799 23.2318 16.9779C23.8125 15.5759 24.1114 14.0732 24.1114 12.5557C24.1114 11.0382 23.8125 9.53554 23.2318 8.13354C22.6511 6.73153 21.7999 5.45764 20.7268 4.38459C19.6538 3.31154 18.3799 2.46036 16.9779 1.87963C15.5759 1.2989 14.0732 1 12.5557 1C11.0382 1 9.53554 1.2989 8.13354 1.87963C6.73153 2.46036 5.45764 3.31154 4.38459 4.38459C2.21747 6.55171 1 9.49095 1 12.5557C1 15.6205 2.21747 18.5597 4.38459 20.7268C6.55171 22.894 9.49095 24.1114 12.5557 24.1114C15.6205 24.1114 18.5597 22.894 20.7268 20.7268Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
    </>
  );
};

export default MainSearch;
