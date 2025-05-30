Feature: Validimi i Menaxhimit të Mesazheve
  Si administrator i sistemit
  Unë dua të kem validim për menaxhimin e mesazheve
  Në mënyrë që të menaxhoj komunikimin me klientët

  Background:
    Given Jam i kyçur si administrator
    And Jam në faqen e menaxhimit të mesazheve

  Scenario: Shikimi i mesazheve të palexuara
    When Unë shoh listën e mesazheve
    Then Duhet të shoh numrin e mesazheve të palexuara
    And Duhet të shoh detajet e secilit mesazh

  Scenario: Shënuarja e një mesazhi si të lexuar
    Given Ekziston një mesazh i palexuar
    When Unë shënoj mesazhin si të lexuar
    Then Statusi i mesazhit duhet të ndryshojë
    And Numri i mesazheve të palexuara duhet të ulet

  Scenario: Fshirja e një mesazhi
    Given Ekziston një mesazh në sistem
    When Unë fshij mesazhin
    Then Mesazhi duhet të largohet nga sistemi
    And Nuk duhet të shfaqet më në listë 