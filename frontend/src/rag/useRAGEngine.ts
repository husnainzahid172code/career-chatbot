import { useCallback, useEffect, useState } from "react";
import type { FAQSchema } from "../types";
import { buildGroundingBlock, findBestRAGHit, loadFAQ } from "./ragEngine";

export function useRAGEngine() {
  const [faq, setFaq] = useState<FAQSchema | null>(null);
  const [faqError, setFaqError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    loadFAQ()
      .then((data) => {
        if (!mounted) return;
        setFaq(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setFaqError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      mounted = false;
    };
  }, []);

  const getHit = useCallback(
    (userQuery: string) => {
      if (!faq) return null;
      return findBestRAGHit(faq, userQuery);
    },
    [faq]
  );

  const getGroundingText = useCallback(
    (userQuery: string) => {
      const hit = getHit(userQuery);
      if (!hit) return null;
      return buildGroundingBlock(hit);
    },
    [getHit]
  );

  return { faqReady: !!faq, faqError, getHit, getGroundingText };
}

