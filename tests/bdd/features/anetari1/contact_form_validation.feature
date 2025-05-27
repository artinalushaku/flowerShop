Feature: Validimi i Formës së Kontaktit
  Si vizitor i faqes
  Unë dua të kem validim në formën e kontaktit
  Në mënyrë që të dërgoj kërkesa të sakta

  Background:
    Given Jam në faqen e kontaktit

  Scenario: Dërgimi i një forme kontakti me subjekt të vlefshëm
    When Unë fut një subjekt me 25 karaktere
    Then Forma duhet të pranojë subjektin
    And Nuk duhet të shoh gabime validimi

  Scenario: Dërgimi i një forme kontakti me subjekt shumë të shkurtër
    When Unë fut një subjekt me 2 karaktere
    Then Forma duhet të tregojë një gabim validimi
    And Duhet të shoh një mesazh që tregon minimum 3 karaktere të kërkuara 