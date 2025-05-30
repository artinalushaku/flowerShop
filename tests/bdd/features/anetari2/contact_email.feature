Feature: Validimi i Email-it në Formën e Kontaktit
  Si vizitor i faqes
  Unë dua të kem validim për email-in në formën e kontaktit
  Në mënyrë që të marr përgjigje në adresën e duhur

  Background:
    Given Jam në faqen e kontaktit

  Scenario: Dërgimi i një forme kontakti me email të vlefshëm
    When Unë fut një email të vlefshëm "klient@email.com"
    Then Forma duhet të pranojë email-in
    And Nuk duhet të shoh gabime validimi

  Scenario: Dërgimi i një forme kontakti me email të pavlefshëm
    When Unë fut një email të pavlefshëm "emaili.joformati"
    Then Forma duhet të tregojë një gabim validimi
    And Duhet të shoh një mesazh që tregon formatin e duhur të email-it

  Scenario: Dërgimi i një forme kontakti pa email
    When Unë lë email-in bosh
    Then Forma duhet të tregojë një gabim validimi
    And Duhet të shoh një mesazh që tregon që email-i është i detyrueshëm 