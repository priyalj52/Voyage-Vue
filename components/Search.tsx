import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
const SearchBox = () => {
  return (
    <div className=" relative sm:block hidden">
      <Input
        type="text"
        placeholder="Search..."
        className="pl-10 bg-primary/10"
      />
      <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
    </div>
  );
};

export default SearchBox;
