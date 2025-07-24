// src/global.d.ts

declare namespace React {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    // Add the webkitdirectory attribute to the input element
    webkitdirectory?: string;
  }
}