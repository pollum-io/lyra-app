"use client";

import { animated, useTransition } from "@react-spring/web";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  containerStyle?: string;
  contentContainerStyle?: string;
}

export default function Modal({
  isOpen = false,
  containerStyle = "",
  contentContainerStyle = "",
  children,
  onClose,
}: ModalProps) {
  const transition = useTransition(isOpen, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const Component =
    transition(
      (style, item) =>
        item && (
          <animated.div
            style={{ ...style }}
            className="fixed inset-0 z-50 bg-black bg-opacity-70 "
          >
            <div
              className={`flex h-screen items-center justify-center max-[639px]:items-end ${containerStyle}`}
            >
              <div
                className={`relative min-w-[280px] rounded-[20px] shadow-lg max-[639px]:min-w-[100%] ${contentContainerStyle}`}
              >
                <button
                  type="button"
                  className="absolute right-2.5 top-7 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-transparent dark:hover:text-white"
                  onClick={onClose}
                >
                  <svg
                    className="h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
                {children}
              </div>
            </div>
          </animated.div>
        )
    ) ?? null;

  return Component;
}
