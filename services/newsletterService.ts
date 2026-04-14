/**
 * Mock service to simulate Brevo (Sendinblue) integration.
 * In a real environment, this would call the Brevo API via a serverless function.
 * 
 * AUTOMATED EMAIL SEQUENCE CONFIGURED IN BREVO:
 * - Email 1 (immédiat) : livraison du guide PDF "5 erreurs qui abîment votre parquet"
 * - Email 2 (J+2) : "Les signes que votre parquet a besoin d'un entretien"
 * - Email 3 (J+5) : présentation du Plan Entretien avec témoignage client
 * - Email 4 (J+7) : offre limitée — "1er mois offert si vous souscrivez cette semaine"
 * - Email 5 (J+14) : dernière relance avec FAQ et CTA WhatsApp direct
 */

export const subscribeToNewsletter = async (email: string, source: string): Promise<boolean> => {
  console.log(`[BREVO MOCK] Subscribing ${email} from source: ${source}`);
  console.log(`[BREVO MOCK] Triggering Automation Workflow: "Lead Magnet - Guide Parquet"`);
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1200);
  });
};
