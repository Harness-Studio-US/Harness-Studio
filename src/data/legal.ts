export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export const legalVersion = "2026-11-15-account";
export const legalEffectiveLabel = "15 November 2026";

export type LegalDocument = {
  eyebrow: string;
  title: string;
  effective: string;
  summary: string;
  intro: string[];
  sections: LegalSection[];
};

export const privacyPolicy: LegalDocument = {
  eyebrow: "Legal · Privacy",
  title: "Privacy Policy",
  effective: legalEffectiveLabel,
  summary:
    "How Harness Studio handles information for the Harness Copilot app for Windows devices and web browsers.",
  intro: [
    `This privacy policy applies to the Harness Copilot app for Windows devices and web browsers, together with any related services operated by Harness Studio (collectively, the "Application"). Harness Studio is hereby referred to as the "Service Provider".`,
  ],
  sections: [
    {
      id: "what-information",
      title: "What information does the Application obtain and how is it used?",
      blocks: [
        {
          type: "p",
          text: `The web version of the Application uses Firebase Authentication, a Google service, to create and sign in to accounts. When you create an account or sign in, Firebase processes your email address, password, and a Firebase user identifier. Harness Studio receives your email address and user identifier but does not receive or store your password. We use this information only to authenticate you, keep you signed in, display your account, and record your acceptance of the Terms & Conditions and this Privacy Policy.`,
        },
        {
          type: "p",
          text: `Your Copilot conversations and workspace preferences are stored in your browser's localStorage, scoped to your account on that browser. They are not uploaded to a Harness Studio server. Preview replies are generated locally and are simulated. Firebase may store a session token in your browser so that you remain signed in.`,
        },
        {
          type: "p",
          text: `Firebase and its infrastructure providers may process technical data such as your IP address and browser information to deliver authentication, secure the service, and prevent abuse. We do not use this information for advertising or tracking, and we do not sell personal information.`,
        },
      ],
    },
    {
      id: "location",
      title: "Does the Application collect precise real time location information of the device?",
      blocks: [
        {
          type: "p",
          text: `This Application does not collect precise information about the location of your Windows device or computer.`,
        },
      ],
    },
    {
      id: "third-parties",
      title:
        "Do third parties see and/or have access to information obtained by the Application?",
      blocks: [
        {
          type: "p",
          text: `We do not sell or rent personal information. Authentication is provided by Firebase Authentication, a Google service. Google processes account information on our behalf as a service provider and according to its own terms and privacy policy. We may disclose information if required by law or necessary to protect rights and safety. Conversation content remains in your browser and is not shared by us.`,
        },
      ],
    },
    {
      id: "opt-out",
      title: "What are my opt-out rights?",
      blocks: [
        {
          type: "p",
          text: `You can sign out at any time. You can delete individual conversations or clear your browser storage to remove local workspace data. Deleting local browser data does not delete your Firebase account.`,
        },
        {
          type: "p",
          text: `To request deletion of your account and the email address and user identifier associated with it, email message.harness.studio@outlook.com. We will action verified requests within a reasonable period. If you contact the Service Provider directly, you may also request access to or correction of the information you provided.`,
        },
      ],
    },
    {
      id: "children",
      title: "Children",
      blocks: [
        {
          type: "p",
          text: `The Application is not intended for children under 16 years of age, or such higher age as required by applicable law. Do not create an account or use the account features if you are under that age. The Service Provider does not knowingly collect account information from children or market to them. If we learn that an account belongs to a child under the applicable age, we will take reasonable steps to delete the account and associated information. If you believe a child has created an account, contact message.harness.studio@outlook.com.`,
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        {
          type: "p",
          text: `Account authentication is handled by Firebase Authentication, and account data is transmitted over HTTPS. The Service Provider implements reasonable technical and organisational safeguards to protect the information it holds. No security system is completely secure, so absolute security cannot be guaranteed.`,
        },
      ],
    },
    {
      id: "data-breach",
      title: "Data Breach Notification",
      blocks: [
        {
          type: "p",
          text: `If a data breach occurs that affects your account information, the Service Provider will notify affected users and relevant authorities as required by applicable law.`,
        },
      ],
    },
    {
      id: "changes",
      title: "Changes",
      blocks: [
        {
          type: "p",
          text: `The Service Provider may update this Privacy Policy from time to time. The Service Provider will notify you of material changes by posting the updated Privacy Policy with an effective date. Where required by law, the Service Provider will seek your consent to material changes before they take effect.`,
        },
        {
          type: "p",
          text: `Previous versions of this Privacy Policy will be maintained and made available upon request by contacting the Service Provider at message.harness.studio@outlook.com.`,
        },
        {
          type: "p",
          text: `This privacy policy is effective as of ${legalEffectiveLabel}.`,
        },
      ],
    },
    {
      id: "consent",
      title: "Your Consent",
      blocks: [
        {
          type: "p",
          text: `Where processing is based on your consent, you may withdraw that consent at any time without affecting processing carried out before withdrawal. Account authentication is necessary to provide the account features; you can stop using those features by signing out and requesting deletion of your account.`,
        },
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      blocks: [
        {
          type: "p",
          text: `If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at message.harness.studio@outlook.com.`,
        },
      ],
    },
  ],
};

export const termsOfService: LegalDocument = {
  eyebrow: "Legal · Terms",
  title: "Terms & Conditions",
  effective: legalEffectiveLabel,
  summary:
    "The terms that govern use of the Harness Copilot app for Windows devices and web browsers.",
  intro: [
    `These terms and conditions apply to the Harness Copilot app for Windows devices and web browsers, together with any related services operated by Harness Studio (collectively, the "Application"). Harness Studio is hereby referred to as the "Service Provider".`,
    `By downloading or using the Application, you agree to these Terms and Conditions. You should read them carefully before using the Application.`,
  ],
  sections: [
    {
      id: "license",
      title: "License to use the Application",
      blocks: [
        {
          type: "p",
          text: `Subject to your compliance with these Terms, the Service Provider grants you a limited, non-exclusive, non-transferable, revocable license to install and use the Application on a Windows device or computer for personal or internal business purposes. You may not reproduce, distribute, modify, create derivative works from, reverse engineer, decompile, or disassemble the Application, except as and only to the extent that such activity is expressly permitted by applicable law.`,
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      blocks: [
        {
          type: "p",
          text: `The Service Provider retains all intellectual property rights in the Application, including its code, design, trademarks, service marks, trade names, logos, and branding (the "IP"). Nothing in these Terms grants you any license or right to use the Service Provider's trademarks, logos, or branding for any purpose. You agree not to remove, alter, or obscure any copyright, trademark, or other proprietary notices displayed in or on the Application.`,
        },
      ],
    },
    {
      id: "termination",
      title: "Termination",
      blocks: [
        {
          type: "p",
          text: `The Service Provider may suspend your access to the Application or services if you materially breach these Terms. The Service Provider will provide you with written notice of the breach and, where the breach is capable of cure, you will have 14 days from receipt of notice to remedy the breach. If you fail to cure the breach within that period, the Service Provider may terminate your access.`,
        },
        {
          type: "p",
          text: `The Service Provider may suspend or terminate your access immediately without notice if you violate applicable law, infringe intellectual property rights, or engage in activity that could cause harm to other users or the Service Provider.`,
        },
        {
          type: "p",
          text: `Upon termination, your right to use the Application will end and you must delete all copies from your devices.`,
        },
        {
          type: "p",
          text: `By accessing and using this Application, you represent that you are legally permitted to use it in your jurisdiction. You must be at least 16 years of age (the age of digital consent in your jurisdiction) to use the Application. If you are below 16, a parent or legal guardian must review and accept these Terms on your behalf.`,
        },
        {
          type: "p",
          text: `Unauthorized copying, modification of the Application, any part of the Application, or the Service Provider's trademarks is strictly prohibited. Any attempts to extract the source code of the Application, translate the Application into other languages, or create derivative versions are not permitted. All trademarks, copyrights, database rights, and other intellectual property rights related to the Application remain the property of the Service Provider.`,
        },
      ],
    },
    {
      id: "user-content",
      title: "User-Generated Content and Acceptable Use",
      blocks: [
        {
          type: "p",
          text: `If this Application allows users to post, share, or upload content, you agree not to post content that:`,
        },
        {
          type: "list",
          items: [
            "Is illegal or violates third-party intellectual property rights (copyright, trademark, patents)",
            "Is abusive, threatening, harassing, defamatory, or hate speech",
            "Contains discrimination or incitement to violence or illegal activity",
            "Is spam, phishing, or contains malware",
            "Violates the privacy or personal data rights of others",
            "Is misleading, false, or deceptive",
            "Contains explicit violence or sexual content (unless age-gated appropriately)",
          ],
        },
        {
          type: "p",
          text: `The Service Provider reserves the right to:`,
        },
        {
          type: "list",
          items: [
            "Remove or disable access to content that violates these guidelines",
            "Suspend or terminate accounts of users who repeatedly violate these guidelines",
            "Cooperate with law enforcement if illegal content is reported",
            "Moderate, filter, or hide content that violates these Terms, applicable law, or the guidelines set out above",
          ],
        },
        {
          type: "p",
          text: `Content submitted through the Application may be visible to other users or to the public, depending on how the Application functions.`,
        },
        {
          type: "p",
          text: `If you believe content violates these Terms, infringes your rights, or is unlawful, you may report it to the Service Provider at message.harness.studio@outlook.com. The report should include enough information for the Service Provider to identify the content, evaluate the complaint, and contact you if follow-up is required.`,
        },
        {
          type: "p",
          text: `Where the Application provides such features, you may also report content, block other users, or mute notifications directly through the Application's interface. The Service Provider will review in-app reports with the same standards described in these Terms.`,
        },
        {
          type: "p",
          text: `The Service Provider may review reported content, request additional information where necessary, remove or restrict access to content, and take action against the responsible account where appropriate. Users affected by moderation decisions may contact the Service Provider at message.harness.studio@outlook.com to request further review. The Service Provider will respond to appeals within a reasonable period and provide the reasons for any upheld moderation decision, subject to applicable law.`,
        },
        {
          type: "p",
          text: `By submitting User-Generated Content you grant the Service Provider a non-exclusive, worldwide, royalty-free license to use, reproduce, distribute, prepare derivative works of, display and perform the content in connection with the Application and the Service Provider's business. This license does not grant the Service Provider the right to sell or sublicense your content to third parties independently of the Application. You represent and warrant that you own or control all rights in the content you post and that use of the content does not violate these Terms or applicable law.`,
        },
        {
          type: "p",
          text: `Your content may include personal data. Processing of personal data related to User-Generated Content is governed by the Privacy Policy. Do not post personal data of others without their consent.`,
        },
        {
          type: "p",
          text: `The Service Provider is dedicated to ensuring that the Application is as beneficial and efficient as possible. As such, they reserve the right to modify the Application or charge for their services at any time and for any reason. The Service Provider assures you that any charges for the Application or its services will be clearly communicated to you.`,
        },
        {
          type: "p",
          text: `The Application stores and processes personal data that you have provided to the Service Provider in order to provide the Service. It is your responsibility to maintain the security of your Windows device or computer and access to the Application.`,
        },
        {
          type: "p",
          text: `Please be aware that the Service Provider does not assume responsibility for certain aspects. Some functions of the Application require an active internet connection. The Service Provider cannot be held responsible if the Application does not function at full capacity due to lack of access to the internet or if you have exhausted your data allowance.`,
        },
        {
          type: "p",
          text: `If you are using the Application, please be aware that your internet service provider's agreement terms still apply. Consequently, you may incur charges from your internet provider for data usage during the use of the Application. By using the Application, you accept responsibility for any such charges.`,
        },
        {
          type: "p",
          text: `Similarly, the Service Provider cannot always assume responsibility for your usage of the application. For instance, it is your responsibility to ensure that your device remains charged. If your device runs out of battery and you are unable to access the Service, the Service Provider cannot be held responsible.`,
        },
        {
          type: "p",
          text: `Nothing in these Terms shall limit any rights you have under applicable consumer protection laws that cannot be lawfully excluded.`,
        },
      ],
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      blocks: [
        {
          type: "p",
          text: `To the fullest extent permitted by law, the Service Provider shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to lost profits, data loss, or business interruption, even if advised of the possibility of such damages.`,
        },
        {
          type: "p",
          text: `However, the Service Provider retains full liability for:`,
        },
        {
          type: "list",
          items: [
            "Death or personal injury caused by negligence",
            "Fraud or fraudulent misrepresentation",
            "Any other liability that cannot be excluded or limited under applicable law",
          ],
        },
        {
          type: "p",
          text: `To the fullest extent permitted by law, the total liability of the Service Provider for any claim shall not exceed the amount paid by you to the Service Provider for the Application in the 12 months preceding the claim, or the minimum amount that must be paid under applicable law, whichever is greater. If the Application is provided free of charge, this means the Service Provider's liability is limited to the minimum amount permitted by applicable law.`,
        },
        {
          type: "p",
          text: `The Service Provider accepts no liability for any loss, direct or indirect, that you experience as a result of relying entirely on third-party information provided through this Application, or for inaccuracies in content provided by third parties.`,
        },
      ],
    },
    {
      id: "indemnification",
      title: "Indemnification",
      blocks: [
        {
          type: "p",
          text: `To the fullest extent permitted by law, you agree to indemnify and hold harmless the Service Provider, its affiliates, officers, directors, employees and agents from and against any claims, liabilities, damages, losses and expenses, including reasonable legal fees, arising out of or directly related to your breach of these Terms or your intentional misuse of the Application, including User-Generated Content you submit in violation of these Terms.`,
        },
        {
          type: "p",
          text: `This indemnification does not apply to claims arising from the Service Provider's own negligence, breach of these Terms, or violation of applicable law. In jurisdictions where consumer indemnification is restricted by law, this clause shall be limited to the maximum extent permitted.`,
        },
      ],
    },
    {
      id: "application-updates",
      title: "Application Updates and Availability",
      blocks: [
        {
          type: "p",
          text: `The Service Provider may wish to update the application at some point. The application is currently available as per the requirements for the operating system (and for any additional systems they decide to extend the availability of the application to) may change, and you will need to download the updates if you want to continue using the application. The Service Provider does not guarantee that it will always update the application so that it is relevant to you and/or compatible with the particular operating system version installed on your device. You should accept updates when offered; if you choose not to, the Service Provider may cease to support earlier versions and the Application may not function properly. The Service Provider may also wish to cease providing the application and may terminate its use at any time without providing termination notice to you. Unless they inform you otherwise, upon any termination, (a) the rights and licenses granted to you in these terms will end; (b) you must cease using the application, and (if necessary) delete it from your device.`,
        },
      ],
    },
    {
      id: "governing-law",
      title: "Governing Law and Jurisdiction",
      blocks: [
        {
          type: "p",
          text: `These Terms and Conditions are governed by the laws of the jurisdiction in which the Service Provider is established, excluding conflict of law rules, except to the extent mandatory consumer protection laws provide otherwise.`,
        },
        {
          type: "p",
          text: `Any dispute arising out of or relating to these Terms will be brought before the courts that have jurisdiction under applicable law. Nothing in this clause limits any rights you may have to bring a claim in a court that is competent under mandatory law.`,
        },
      ],
    },
    {
      id: "dsa",
      title: "DSA Compliance (Digital Services Act)",
      blocks: [
        {
          type: "p",
          text: `If the Application is an intermediary service as defined under the Digital Services Act (Regulation (EU) 2022/2065, "DSA"), the following provisions apply in addition to the terms above.`,
        },
        {
          type: "h3",
          text: "Point of Contact",
        },
        {
          type: "p",
          text: `The Service Provider maintains a single point of contact for direct communication with EU authorities and recipients of the service, reachable at message.harness.studio@outlook.com. Where the Service Provider is established outside the European Union, a legal representative in the EU has been designated in accordance with Article 13 of the DSA.`,
        },
        {
          type: "h3",
          text: "Content Moderation and Statement of Reasons",
        },
        {
          type: "p",
          text: `When the Service Provider restricts access to content, suspends or terminates an account, or otherwise limits the availability of the Application's features, a clear and specific statement of reasons will be provided to the affected user. The statement will include the nature of the restriction, the legal or contractual basis for the decision, and information on available redress mechanisms, in accordance with Article 17 of the DSA.`,
        },
        {
          type: "h3",
          text: "Notice and Action",
        },
        {
          type: "p",
          text: `Users and third parties may submit notices of allegedly illegal content through the contact details provided in these Terms. The Service Provider will process notices promptly, diligently, and without automated decision-making where the circumstances require human review. Notices will be acknowledged electronically and a decision communicated without undue delay, in accordance with Article 16 of the DSA.`,
        },
        {
          type: "h3",
          text: "Out-of-Court Dispute Settlement",
        },
        {
          type: "p",
          text: `Disputes regarding content moderation decisions, including decisions to restrict content or suspend accounts, may be submitted to an out-of-court dispute settlement body certified in accordance with Article 21 of the DSA. The Service Provider will engage with such bodies in good faith. Use of out-of-court dispute settlement does not affect your right to seek judicial remedy under applicable law.`,
        },
        {
          type: "h3",
          text: "Transparency Reporting",
        },
        {
          type: "p",
          text: `The Service Provider publishes periodic transparency reports covering content moderation activities, including the volume of notices received, actions taken, and automated means used, in accordance with Article 24 of the DSA. Reports are made available upon request at message.harness.studio@outlook.com.`,
        },
        {
          type: "p",
          text: `These DSA provisions apply to the extent that the Application qualifies as an intermediary service under the DSA and does not replace or limit any rights or obligations under applicable consumer protection or data protection law.`,
        },
      ],
    },
    {
      id: "severability",
      title: "Severability",
      blocks: [
        {
          type: "p",
          text: `If any provision of these Terms and Conditions is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, and the remaining provisions of these Terms shall remain in full force and effect.`,
        },
      ],
    },
    {
      id: "entire-agreement",
      title: "Entire Agreement",
      blocks: [
        {
          type: "p",
          text: `These Terms and Conditions, together with the Privacy Policy, constitute the entire agreement between you and the Service Provider concerning your use of the Application, superseding any prior agreements or understandings.`,
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to These Terms and Conditions",
      blocks: [
        {
          type: "p",
          text: `The Service Provider may periodically update their Terms and Conditions. Therefore, you are advised to review this page regularly for any changes. The Service Provider will notify you of any changes by posting the new Terms and Conditions on this page.`,
        },
        {
          type: "p",
          text: `Previous versions of these Terms and Conditions will be maintained and made available upon request by contacting the Service Provider at message.harness.studio@outlook.com.`,
        },
        {
          type: "p",
          text: `These terms and conditions are effective as of ${legalVersion}.`,
        },
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      blocks: [
        {
          type: "p",
          text: `If you have any questions or suggestions about the Terms and Conditions, please do not hesitate to contact the Service Provider at message.harness.studio@outlook.com.`,
        },
      ],
    },
  ],
};
