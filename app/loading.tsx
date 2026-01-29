import React from "react";
import FullPageLoading from "@/components/ui/FullPageLoading";

/**
 * Default loading state for the entire application.
 * This will show during route transitions and initial loads.
 */
export default function Loading() {
  return <FullPageLoading />;
}
