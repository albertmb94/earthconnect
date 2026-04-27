import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { useI18n } from '../lib/i18n';
import { Shield } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const { t } = useI18n();

  return (
    <CookieConsent
      location="bottom"
      buttonText={t.cookieAccept}
      declineButtonText={t.cookieDecline}
      enableDeclineButton
      cookieName="ec_gdpr_consent"
      style={{
        background: "rgba(9, 9, 11, 0.95)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(39, 39, 42, 0.8)",
        padding: "16px 24px",
        fontFamily: "inherit",
        alignItems: "center",
        boxShadow: "0 -10px 25px -5px rgba(0,0,0,0.3)"
      }}
      buttonStyle={{
        background: "#ffffff",
        color: "#09090b",
        fontSize: "13px",
        fontWeight: "600",
        borderRadius: "8px",
        padding: "8px 16px",
        margin: "0 0 0 12px",
        cursor: "pointer",
        transition: "all 0.2s"
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "#a1a1aa",
        fontSize: "13px",
        borderRadius: "8px",
        padding: "8px 12px",
        margin: "0",
        cursor: "pointer",
        transition: "all 0.2s",
        border: "1px solid rgba(39, 39, 42, 0.5)"
      }}
      contentStyle={{
        margin: "0",
        padding: "0"
      }}
      expires={150}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-300 shrink-0">
          <Shield className="w-4 h-4" />
        </div>
        <div className="text-xs md:text-sm text-zinc-300 max-w-3xl leading-normal">
          {t.cookieConsent}
        </div>
      </div>
    </CookieConsent>
  );
};
