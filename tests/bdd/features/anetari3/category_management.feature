Feature: Validimi i Kategorive të Produkteve
  Si administrator i dyqanit
  Unë dua të kem validim për kategoritë e produkteve
  Në mënyrë që të organizoj produktet në mënyrë efikase

  Background:
    Given Jam i kyçur si administrator
    And Jam në faqen e menaxhimit të produkteve

  Scenario: Shikimi i kategorive ekzistuese
    When Unë shoh listën e kategorive
    Then Duhet të shoh të gjitha kategoritë
    And Duhet të shoh numrin e produkteve për kategori

  Scenario: Shtimi dhe fshirja e një kategorie të re
    When Unë shtoj një kategori të re "Orkide"
    Then Kategoria duhet të shtohet në listë
    When Unë fshij kategorinë "Orkide"
    Then Kategoria "Orkide" duhet të largohet nga sistemi 