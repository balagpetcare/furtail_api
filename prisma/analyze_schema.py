"""
Phase 5 Schema Analysis Script
Parses prisma/schema.prisma, extracts all model blocks,
builds a relation dependency graph, and determines what can
safely be removed vs what must stay or be marked REVIEW.
"""
import re
import sys
from collections import defaultdict

SCHEMA_PATH = "prisma/schema.prisma"

def extract_models(content):
    """Extract model blocks: {name: (start, end, body)}"""
    models = {}
    pattern = re.compile(r'^model\s+(\w+)\s*\{', re.MULTILINE)
    for m in pattern.finditer(content):
        name = m.group(1)
        start = m.start()
        depth = 0
        end = start
        for i in range(m.end() - 1, len(content)):
            c = content[i]
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        models[name] = (start, end, content[start:end])
    return models

def find_referenced_models(model_body, all_model_names):
    """Find which models are referenced in @relation fields within a model body."""
    refs = set()
    # Pattern: find TypeName or TypeName? or TypeName[] in field definitions
    # A field line looks like: fieldName  TypeName  @something
    # We look for identifiers that match model names
    for name in all_model_names:
        # Match as a field type: "  fieldName  ModelName" or "  fieldName  ModelName?"  or "  fieldName  ModelName[]"
        if re.search(r'\b' + re.escape(name) + r'[\?\[]?\s', model_body):
            refs.add(name)
    return refs

def main():
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    models = extract_models(content)
    all_names = set(models.keys())

    print(f"Total models found: {len(models)}")

    # Build dependency graph: model -> set of models it references
    deps = {}
    for name, (start, end, body) in models.items():
        refs = find_referenced_models(body, all_names - {name})
        deps[name] = refs

    # Reverse graph: model -> set of models that reference it
    rev_deps = defaultdict(set)
    for name, refs in deps.items():
        for ref in refs:
            rev_deps[ref].add(name)

    # KEEP list (from Phase 5 instructions)
    KEEP = {
        # Animal types
        "AnimalCategory", "AnimalType", "AnimalSize", "AnimalColor", "CoatPattern", "Breed", "SubBreed",
        # User & auth
        "User", "UserAuth", "UserProfile", "UserStatsCache", "UserSession",
        "UserFollow", "UserProfileLike", "UserFriendRequest", "UserFriend",
        "UserAppSettings", "UserNotificationPrefs",
        # Achievement
        "Achievement", "UserAchievement", "UserGalleryItem",
        # Location (owner)
        "Place", "LocationPlace", "UserLocationProfile", "UserLocationEvent",
        # Owner profile (Flutter uses this)
        "OwnerProfile", "OwnerKyc", "OwnerKycDocument",
        # Verification (still active)
        "VerificationLog", "VerificationCase", "VerificationDocument", "VerificationCaseEvent",
        "VerificationLockedUpdateAttempt",
        # Notifications
        "Notification", "NotificationRead", "NotificationDelivery",
        # Social/posts
        "Post", "PostMedia", "PostLike", "PostComment", "PostCommentLike", "Media",
        # Pet
        "Pet", "PetFamilyMember", "PetWeight",
        # Vaccination (Flutter-required)
        "VaccineType", "Vaccination", "VaccinationReminder",
        # Deworming/medical history (Flutter pet profile)
        "DewormingRecord", "MedicalHistory",
        # Reward
        "RewardHistory",
        # Wallet / fundraising
        "UserWallet", "WalletTransaction", "WalletWithdrawRequest", "PayoutEventLog",
        "PayoutAccount",
        "FundraisingUpdate", "FundraisingAccount", "FundraisingAccountStatusLog",
        "FundraisingVerificationDocument", "FundraisingCampaign", "FundraisingCampaignStats",
        "Donation", "FundraisingPayoutMethodCatalog", "FundraisingPayoutMethod",
        "FundraisingWithdrawRequest", "FundraisingPayoutTransferLog",
        # Report
        "Report",
        # BD location hierarchy
        "BdDivision", "BdDistrict", "BdUpazila", "BdUnion", "BdArea",
        "CityCorporation", "Area",
        # Coverage zone (used by CampaignBooking)
        "LocationCoverageAssignment", "CoverageZone", "CoverageZoneArea", "CoverageZoneMetadata",
        # Audit/workspace (admin subset - keep for now)
        "AuditLog",
        # Country/state/geo
        "Country", "State", "LocationCity", "LocationSubDistrict",
        # Policy/meta
        "CountryPolicy", "PolicyFeature", "PolicyDonationRule", "PolicyPaymentMethod",
        "PolicyAdsRule", "PolicyRule",
        "StatePolicy", "StatePolicyFeature", "StatePolicyRule",
        # Ads
        "Ad",
        # Payment (campaign checkout + fundraising)
        "PaymentTransaction", "PaymentTransactionLog",
        # Campaign family (all kept)
        "Campaign", "CampaignConfig", "CampaignConfigHistory",
        "CampaignLocation", "CampaignSlot", "CampaignVaccineType", "CampaignIncludedVaccine",
        "CampaignBooking", "CampaignPet", "CampaignStaff",
        "CampaignSmsTemplate", "CampaignSmsLog", "SmsLog",
        "CampaignAuditLog", "CampaignRolloutPhase", "CampaignRolloutRegion",
        "CampaignPreRegistration", "CampaignCheckoutSession",
        # SMS
        "SmsLog",
    }

    # Compute all models that KEEP models depend on (transitively)
    def transitive_deps(start_set, deps_map):
        visited = set(start_set)
        queue = list(start_set)
        while queue:
            current = queue.pop()
            for dep in deps_map.get(current, set()):
                if dep not in visited:
                    visited.add(dep)
                    queue.append(dep)
        return visited

    keep_with_deps = transitive_deps(KEEP, deps)
    print(f"\nKEEP set (direct): {len(KEEP)}")
    print(f"KEEP set (with transitive deps): {len(keep_with_deps)}")

    # Models referenced by KEEP but not in explicit KEEP list = REVIEW
    review = keep_with_deps - KEEP
    print(f"\nREVIEW models (referenced by KEEP but not explicitly listed): {len(review)}")
    for m in sorted(review):
        print(f"  REVIEW: {m}")

    # Everything else = REMOVE
    remove = all_names - keep_with_deps
    print(f"\nSAFE TO REMOVE: {len(remove)} models")
    for m in sorted(remove):
        print(f"  REMOVE: {m}")

    # Summary
    print(f"\n=== SUMMARY ===")
    print(f"Total models: {len(all_names)}")
    print(f"KEEP (explicit): {len(KEEP & all_names)}")
    print(f"REVIEW (transitive deps): {len(review)}")
    print(f"REMOVE: {len(remove)}")

if __name__ == "__main__":
    main()
