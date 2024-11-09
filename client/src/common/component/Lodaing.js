import React from "react";

export const Lodaing = () => {
  return (
    <div>
      <button class="btn" type="button" disabled>
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Loading...
      </button>
    </div>
  );
};
