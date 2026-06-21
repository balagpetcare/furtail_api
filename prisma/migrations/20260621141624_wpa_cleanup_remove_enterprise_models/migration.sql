/*
  Warnings:

  - You are about to drop the `BranchTypeOnBranch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `access_invites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_forecast_snapshots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_job_runs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_procurement_recommendations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_recommendation_overrides` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_replenishment_suggestions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `allocation_plan_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `allocation_plan_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `allocation_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `allocation_source_summaries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `applied_discounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `appointment_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `approval_action_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit_bin_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit_bins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_batches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_codes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_product_proofs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_verification_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `backorders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `batch_pricing_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `batch_recalls` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `batch_serial_allocation_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `batch_serial_states` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `batches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_access_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_compliance_scores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_holidays` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_item_batches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_item_stocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_member_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_overhead_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_override_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_pricings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_publish_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_to_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `case_cost_sheets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `case_evidence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catalog_enable_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinic_approval_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinic_catalog_install_batches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinic_room_blocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_item_approval_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_item_audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_item_branch_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_item_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_item_media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_item_variants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_notes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_stock_audit_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_stock_audits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_stock_ledger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_stock_transfer_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_stock_transfers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_supply_request_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_supply_request_status_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_supply_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_wastage_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `commission_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `complaint_cases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `consultation_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `consumable_item_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `consumption_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contracts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cost_allocation_policies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cost_driver_inputs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cost_facts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `country_medicine_brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cts_summaries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `daily_medicine_variances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `daily_reconciliations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `decision_approval_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `decision_package_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `decision_packages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `delivery_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `destruction_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discount_approval_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discount_audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discount_policies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dispatch_receive_session_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dispatch_receive_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dispense_request_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dispense_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_contract_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_contracts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_credentials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_leave_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_licenses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_package_mappings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_schedule_exceptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_schedule_proposals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_schedule_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_service_assignment_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_service_fee_change_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_service_fees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_service_mappings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_settlement_batches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_settlement_ledger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_verification_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `enforcement_actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `enterprise_discount_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exception_severity_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `expiry_write_off_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `factories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flavors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `governance_incidents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grn_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inbound_discrepancies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inbound_shipment_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inbound_shipments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `injection_token_medication_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `injection_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `instrument_instances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `instrument_issue_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `instrument_item_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `integration_mappings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_consumptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_variance_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoice_cost_sheets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lab_report_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lab_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lab_requisitions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `location_prices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `location_variant_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `manager_approval_escalations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `master_clinical_catalog_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `master_clinical_catalog_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `master_clinical_catalog_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `master_product_catalog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `master_product_media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `master_product_variants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medication_administrations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_approval_actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_approval_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_control_day_closes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_discrepancies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_dosage_forms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_generics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_import_batches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_import_entity_touches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_import_rows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_incidents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_item_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_manufacturers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_master_audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_policies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_presentations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_requisition_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_requisition_timeline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_requisitions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `membership_tier_branch_scopes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `membership_tier_exclusions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `membership_tiers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `network_balance_snapshots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `network_transfer_recommendations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `network_transfer_routes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `operational_exception_indices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `operational_exception_rcas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `org_directors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `org_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `org_feature_flags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `org_member_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `org_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `org_quotas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organization_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `outside_medicine_receives` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `owner_delegations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `owner_discount_cards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `owner_overview_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `owner_permission_scopes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `owner_team_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `owner_teams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `package_audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `package_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `package_price_change_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `package_price_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `packaging_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `partner_applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pick_list_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pick_lists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pos_cart_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pos_carts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pos_credit_notes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prescription_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prescriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `price_approval_matrix_rows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `price_change_approval_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `price_resolution_snapshots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `price_schedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pricing_audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pricing_campaign_scopes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pricing_campaigns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pricing_emergency_overrides` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `procedure_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `procurement_demand_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `producer_approvals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `producer_audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `producer_email_recipients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `producer_factories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `producer_org_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `producer_org_staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `producer_orgs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `producer_staff_invite_deliveries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `producer_staff_invites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_change_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_fingerprints` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_import_batches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_import_rows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_pricings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_revisions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_versions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `production_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proof_of_deliveries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_order_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_requisition_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_requisitions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `putaway_tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `qc_inspections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `queue_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `queue_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `queue_tickets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quota_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quota_usages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recall_campaigns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `replenishment_recommendations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `retail_discount_approval_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `retail_discount_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `return_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `return_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reverse_logistics_cases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_schedule_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scan_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scenario_result_snapshots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scenario_runs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `serial_ranges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `serials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_deliveries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_level_objectives` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_pricing_change_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_pricing_variants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_proposals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settlement_adjustments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settlement_audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settlement_payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `slo_measurements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `slot_locks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff_invites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sterilization_cycle_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sterilization_cycles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_adjustment_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_balances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_count_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_count_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_discrepancies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_dispatch_discrepancies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_dispatch_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_dispatches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_ledgers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_lot_balances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_lots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_request_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_return_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_returns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_transfer_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_transfers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `super_admin_whitelist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `support_tickets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `surgery_case_checklists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `surgery_case_staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `surgery_case_status_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `surgery_package_consumptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `surgery_package_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_invitations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `template_category_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ticket_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ticket_audit_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ticket_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `treatment_course_doses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `treatment_courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `treatment_day_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `treatment_days` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `treatment_revisions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `units` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_contexts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_country_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_global_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_medicine_risk_scores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_state_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vaccine_inventory_mappings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendor_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendor_contacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendor_ledger_entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendor_product_listings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendor_receive_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendor_return_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendor_returns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vet_countries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vet_regulatory_bodies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vet_required_doc_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vial_instances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vial_return_controls` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vial_returns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vial_session_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vial_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visit_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vital_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehouse_audit_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehouse_staff_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehouse_transfer_order_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehouse_transfer_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspace_alerts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspace_approval_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspace_task_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspace_tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `write_off_request_lines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `write_off_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BranchTypeOnBranch" DROP CONSTRAINT "BranchTypeOnBranch_branchId_fkey";

-- DropForeignKey
ALTER TABLE "BranchTypeOnBranch" DROP CONSTRAINT "BranchTypeOnBranch_branchTypeId_fkey";

-- DropForeignKey
ALTER TABLE "access_invites" DROP CONSTRAINT "access_invites_acceptedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "access_invites" DROP CONSTRAINT "access_invites_countryId_fkey";

-- DropForeignKey
ALTER TABLE "access_invites" DROP CONSTRAINT "access_invites_invitedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "access_invites" DROP CONSTRAINT "access_invites_roleId_fkey";

-- DropForeignKey
ALTER TABLE "access_invites" DROP CONSTRAINT "access_invites_stateId_fkey";

-- DropForeignKey
ALTER TABLE "ai_forecast_snapshots" DROP CONSTRAINT "ai_forecast_snapshots_branchId_fkey";

-- DropForeignKey
ALTER TABLE "ai_forecast_snapshots" DROP CONSTRAINT "ai_forecast_snapshots_orgId_fkey";

-- DropForeignKey
ALTER TABLE "ai_forecast_snapshots" DROP CONSTRAINT "ai_forecast_snapshots_variantId_fkey";

-- DropForeignKey
ALTER TABLE "ai_procurement_recommendations" DROP CONSTRAINT "ai_procurement_recommendations_branchId_fkey";

-- DropForeignKey
ALTER TABLE "ai_procurement_recommendations" DROP CONSTRAINT "ai_procurement_recommendations_orgId_fkey";

-- DropForeignKey
ALTER TABLE "ai_procurement_recommendations" DROP CONSTRAINT "ai_procurement_recommendations_variantId_fkey";

-- DropForeignKey
ALTER TABLE "ai_recommendation_overrides" DROP CONSTRAINT "ai_recommendation_overrides_branchId_fkey";

-- DropForeignKey
ALTER TABLE "ai_recommendation_overrides" DROP CONSTRAINT "ai_recommendation_overrides_orgId_fkey";

-- DropForeignKey
ALTER TABLE "ai_recommendation_overrides" DROP CONSTRAINT "ai_recommendation_overrides_userId_fkey";

-- DropForeignKey
ALTER TABLE "ai_recommendation_overrides" DROP CONSTRAINT "ai_recommendation_overrides_variantId_fkey";

-- DropForeignKey
ALTER TABLE "ai_replenishment_suggestions" DROP CONSTRAINT "ai_replenishment_suggestions_branchId_fkey";

-- DropForeignKey
ALTER TABLE "ai_replenishment_suggestions" DROP CONSTRAINT "ai_replenishment_suggestions_locationId_fkey";

-- DropForeignKey
ALTER TABLE "ai_replenishment_suggestions" DROP CONSTRAINT "ai_replenishment_suggestions_orgId_fkey";

-- DropForeignKey
ALTER TABLE "ai_replenishment_suggestions" DROP CONSTRAINT "ai_replenishment_suggestions_productId_fkey";

-- DropForeignKey
ALTER TABLE "ai_replenishment_suggestions" DROP CONSTRAINT "ai_replenishment_suggestions_stockRequestId_fkey";

-- DropForeignKey
ALTER TABLE "ai_replenishment_suggestions" DROP CONSTRAINT "ai_replenishment_suggestions_variantId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plan_events" DROP CONSTRAINT "allocation_plan_events_allocationPlanId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plan_events" DROP CONSTRAINT "allocation_plan_events_orgId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plan_events" DROP CONSTRAINT "allocation_plan_events_performedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plan_lines" DROP CONSTRAINT "allocation_plan_lines_allocationPlanId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plan_lines" DROP CONSTRAINT "allocation_plan_lines_locationId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plan_lines" DROP CONSTRAINT "allocation_plan_lines_lotId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plan_lines" DROP CONSTRAINT "allocation_plan_lines_sourceWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plan_lines" DROP CONSTRAINT "allocation_plan_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plans" DROP CONSTRAINT "allocation_plans_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plans" DROP CONSTRAINT "allocation_plans_fromLocationId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plans" DROP CONSTRAINT "allocation_plans_medicineRequisitionId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plans" DROP CONSTRAINT "allocation_plans_orgId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plans" DROP CONSTRAINT "allocation_plans_parentPlanId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plans" DROP CONSTRAINT "allocation_plans_stockRequestId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_plans" DROP CONSTRAINT "allocation_plans_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_source_summaries" DROP CONSTRAINT "allocation_source_summaries_allocationPlanId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_source_summaries" DROP CONSTRAINT "allocation_source_summaries_dispatchId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_source_summaries" DROP CONSTRAINT "allocation_source_summaries_locationId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_source_summaries" DROP CONSTRAINT "allocation_source_summaries_pickListId_fkey";

-- DropForeignKey
ALTER TABLE "allocation_source_summaries" DROP CONSTRAINT "allocation_source_summaries_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "applied_discounts" DROP CONSTRAINT "applied_discounts_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "applied_discounts" DROP CONSTRAINT "applied_discounts_clinicalCaseId_fkey";

-- DropForeignKey
ALTER TABLE "applied_discounts" DROP CONSTRAINT "applied_discounts_discountPolicyId_fkey";

-- DropForeignKey
ALTER TABLE "applied_discounts" DROP CONSTRAINT "applied_discounts_orderId_fkey";

-- DropForeignKey
ALTER TABLE "appointment_events" DROP CONSTRAINT "appointment_events_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "approval_action_logs" DROP CONSTRAINT "approval_action_logs_branchId_fkey";

-- DropForeignKey
ALTER TABLE "approval_action_logs" DROP CONSTRAINT "approval_action_logs_orgId_fkey";

-- DropForeignKey
ALTER TABLE "audit_bin_items" DROP CONSTRAINT "audit_bin_items_auditBinId_fkey";

-- DropForeignKey
ALTER TABLE "audit_bin_items" DROP CONSTRAINT "audit_bin_items_vialReturnId_fkey";

-- DropForeignKey
ALTER TABLE "audit_bins" DROP CONSTRAINT "audit_bins_branchId_fkey";

-- DropForeignKey
ALTER TABLE "audit_bins" DROP CONSTRAINT "audit_bins_roomId_fkey";

-- DropForeignKey
ALTER TABLE "auth_batches" DROP CONSTRAINT "auth_batches_authProductId_fkey";

-- DropForeignKey
ALTER TABLE "auth_batches" DROP CONSTRAINT "auth_batches_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "auth_batches" DROP CONSTRAINT "auth_batches_printedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "auth_codes" DROP CONSTRAINT "auth_codes_batchId_fkey";

-- DropForeignKey
ALTER TABLE "auth_codes" DROP CONSTRAINT "auth_codes_generatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "auth_codes" DROP CONSTRAINT "auth_codes_issuedAllocationLogId_fkey";

-- DropForeignKey
ALTER TABLE "auth_codes" DROP CONSTRAINT "auth_codes_issuedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "auth_product_proofs" DROP CONSTRAINT "auth_product_proofs_authProductId_fkey";

-- DropForeignKey
ALTER TABLE "auth_product_proofs" DROP CONSTRAINT "auth_product_proofs_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "auth_products" DROP CONSTRAINT "auth_products_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "auth_products" DROP CONSTRAINT "auth_products_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "auth_products" DROP CONSTRAINT "auth_products_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "auth_verification_logs" DROP CONSTRAINT "auth_verification_logs_codeId_fkey";

-- DropForeignKey
ALTER TABLE "auth_verification_logs" DROP CONSTRAINT "auth_verification_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "backorders" DROP CONSTRAINT "backorders_allocationPlanId_fkey";

-- DropForeignKey
ALTER TABLE "backorders" DROP CONSTRAINT "backorders_orgId_fkey";

-- DropForeignKey
ALTER TABLE "backorders" DROP CONSTRAINT "backorders_procurementDemandLineId_fkey";

-- DropForeignKey
ALTER TABLE "backorders" DROP CONSTRAINT "backorders_stockRequestId_fkey";

-- DropForeignKey
ALTER TABLE "backorders" DROP CONSTRAINT "backorders_stockRequestItemId_fkey";

-- DropForeignKey
ALTER TABLE "backorders" DROP CONSTRAINT "backorders_supplementaryPlanId_fkey";

-- DropForeignKey
ALTER TABLE "backorders" DROP CONSTRAINT "backorders_variantId_fkey";

-- DropForeignKey
ALTER TABLE "batch_pricing_rules" DROP CONSTRAINT "batch_pricing_rules_branchId_fkey";

-- DropForeignKey
ALTER TABLE "batch_pricing_rules" DROP CONSTRAINT "batch_pricing_rules_lotId_fkey";

-- DropForeignKey
ALTER TABLE "batch_pricing_rules" DROP CONSTRAINT "batch_pricing_rules_orgId_fkey";

-- DropForeignKey
ALTER TABLE "batch_pricing_rules" DROP CONSTRAINT "batch_pricing_rules_variantId_fkey";

-- DropForeignKey
ALTER TABLE "batch_recalls" DROP CONSTRAINT "batch_recalls_allocationReleasedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "batch_recalls" DROP CONSTRAINT "batch_recalls_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "batch_recalls" DROP CONSTRAINT "batch_recalls_initiatedById_fkey";

-- DropForeignKey
ALTER TABLE "batch_recalls" DROP CONSTRAINT "batch_recalls_lotId_fkey";

-- DropForeignKey
ALTER TABLE "batch_recalls" DROP CONSTRAINT "batch_recalls_orgId_fkey";

-- DropForeignKey
ALTER TABLE "batch_recalls" DROP CONSTRAINT "batch_recalls_resolvedById_fkey";

-- DropForeignKey
ALTER TABLE "batch_serial_allocation_logs" DROP CONSTRAINT "batch_serial_allocation_logs_allocatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "batch_serial_allocation_logs" DROP CONSTRAINT "batch_serial_allocation_logs_batchId_fkey";

-- DropForeignKey
ALTER TABLE "batch_serial_allocation_logs" DROP CONSTRAINT "batch_serial_allocation_logs_revokedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "batch_serial_states" DROP CONSTRAINT "batch_serial_states_batchId_fkey";

-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "batches_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "batches_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "batches_lineId_fkey";

-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "batches_productVersionId_fkey";

-- DropForeignKey
ALTER TABLE "branch_access_permissions" DROP CONSTRAINT "branch_access_permissions_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "branch_access_permissions" DROP CONSTRAINT "branch_access_permissions_branchId_fkey";

-- DropForeignKey
ALTER TABLE "branch_access_permissions" DROP CONSTRAINT "branch_access_permissions_invitedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "branch_access_permissions" DROP CONSTRAINT "branch_access_permissions_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "branch_access_permissions" DROP CONSTRAINT "branch_access_permissions_revokedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "branch_access_permissions" DROP CONSTRAINT "branch_access_permissions_userId_fkey";

-- DropForeignKey
ALTER TABLE "branch_compliance_scores" DROP CONSTRAINT "branch_compliance_scores_branchId_fkey";

-- DropForeignKey
ALTER TABLE "branch_documents" DROP CONSTRAINT "branch_documents_branchProfileId_fkey";

-- DropForeignKey
ALTER TABLE "branch_documents" DROP CONSTRAINT "branch_documents_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "branch_holidays" DROP CONSTRAINT "branch_holidays_branchId_fkey";

-- DropForeignKey
ALTER TABLE "branch_holidays" DROP CONSTRAINT "branch_holidays_orgId_fkey";

-- DropForeignKey
ALTER TABLE "branch_item_batches" DROP CONSTRAINT "branch_item_batches_branchId_fkey";

-- DropForeignKey
ALTER TABLE "branch_item_batches" DROP CONSTRAINT "branch_item_batches_itemId_fkey";

-- DropForeignKey
ALTER TABLE "branch_item_batches" DROP CONSTRAINT "branch_item_batches_sourceClinicalTransferItemId_fkey";

-- DropForeignKey
ALTER TABLE "branch_item_batches" DROP CONSTRAINT "branch_item_batches_sourceGrnLineId_fkey";

-- DropForeignKey
ALTER TABLE "branch_item_batches" DROP CONSTRAINT "branch_item_batches_sourceStockDispatchItemId_fkey";

-- DropForeignKey
ALTER TABLE "branch_item_batches" DROP CONSTRAINT "branch_item_batches_sourceStockLotId_fkey";

-- DropForeignKey
ALTER TABLE "branch_item_batches" DROP CONSTRAINT "branch_item_batches_variantId_fkey";

-- DropForeignKey
ALTER TABLE "branch_item_stocks" DROP CONSTRAINT "branch_item_stocks_branchId_fkey";

-- DropForeignKey
ALTER TABLE "branch_item_stocks" DROP CONSTRAINT "branch_item_stocks_itemId_fkey";

-- DropForeignKey
ALTER TABLE "branch_item_stocks" DROP CONSTRAINT "branch_item_stocks_variantId_fkey";

-- DropForeignKey
ALTER TABLE "branch_member_roles" DROP CONSTRAINT "branch_member_roles_branchMemberId_fkey";

-- DropForeignKey
ALTER TABLE "branch_member_roles" DROP CONSTRAINT "branch_member_roles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "branch_overhead_rules" DROP CONSTRAINT "branch_overhead_rules_branchId_fkey";

-- DropForeignKey
ALTER TABLE "branch_overhead_rules" DROP CONSTRAINT "branch_overhead_rules_orgId_fkey";

-- DropForeignKey
ALTER TABLE "branch_override_requests" DROP CONSTRAINT "branch_override_requests_branchId_fkey";

-- DropForeignKey
ALTER TABLE "branch_override_requests" DROP CONSTRAINT "branch_override_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "branch_override_requests" DROP CONSTRAINT "branch_override_requests_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "branch_override_requests" DROP CONSTRAINT "branch_override_requests_reviewedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "branch_override_requests" DROP CONSTRAINT "branch_override_requests_variantId_fkey";

-- DropForeignKey
ALTER TABLE "branch_pricings" DROP CONSTRAINT "branch_pricings_branchId_fkey";

-- DropForeignKey
ALTER TABLE "branch_pricings" DROP CONSTRAINT "branch_pricings_variantId_fkey";

-- DropForeignKey
ALTER TABLE "branch_publish_requests" DROP CONSTRAINT "branch_publish_requests_branchId_fkey";

-- DropForeignKey
ALTER TABLE "branch_to_types" DROP CONSTRAINT "branch_to_types_branchId_fkey";

-- DropForeignKey
ALTER TABLE "branch_to_types" DROP CONSTRAINT "branch_to_types_typeId_fkey";

-- DropForeignKey
ALTER TABLE "brands" DROP CONSTRAINT "brands_companyId_fkey";

-- DropForeignKey
ALTER TABLE "campaign_bookings" DROP CONSTRAINT "campaign_bookings_locationId_fkey";

-- DropForeignKey
ALTER TABLE "campaign_bookings" DROP CONSTRAINT "campaign_bookings_slotId_fkey";

-- DropForeignKey
ALTER TABLE "case_cost_sheets" DROP CONSTRAINT "case_cost_sheets_clinicalCaseId_fkey";

-- DropForeignKey
ALTER TABLE "case_evidence" DROP CONSTRAINT "case_evidence_caseId_fkey";

-- DropForeignKey
ALTER TABLE "catalog_enable_requests" DROP CONSTRAINT "catalog_enable_requests_branchId_fkey";

-- DropForeignKey
ALTER TABLE "catalog_enable_requests" DROP CONSTRAINT "catalog_enable_requests_locationId_fkey";

-- DropForeignKey
ALTER TABLE "catalog_enable_requests" DROP CONSTRAINT "catalog_enable_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "catalog_enable_requests" DROP CONSTRAINT "catalog_enable_requests_productId_fkey";

-- DropForeignKey
ALTER TABLE "catalog_enable_requests" DROP CONSTRAINT "catalog_enable_requests_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "catalog_enable_requests" DROP CONSTRAINT "catalog_enable_requests_reviewedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "catalog_enable_requests" DROP CONSTRAINT "catalog_enable_requests_variantId_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "clinic_approval_requests" DROP CONSTRAINT "clinic_approval_requests_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "clinic_approval_requests" DROP CONSTRAINT "clinic_approval_requests_branchId_fkey";

-- DropForeignKey
ALTER TABLE "clinic_approval_requests" DROP CONSTRAINT "clinic_approval_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "clinic_approval_requests" DROP CONSTRAINT "clinic_approval_requests_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "clinic_catalog_install_batches" DROP CONSTRAINT "clinic_catalog_install_batches_installedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "clinic_catalog_install_batches" DROP CONSTRAINT "clinic_catalog_install_batches_orgId_fkey";

-- DropForeignKey
ALTER TABLE "clinic_catalog_install_batches" DROP CONSTRAINT "clinic_catalog_install_batches_templateId_fkey";

-- DropForeignKey
ALTER TABLE "clinic_room_blocks" DROP CONSTRAINT "clinic_room_blocks_branchId_fkey";

-- DropForeignKey
ALTER TABLE "clinic_room_blocks" DROP CONSTRAINT "clinic_room_blocks_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "clinic_room_blocks" DROP CONSTRAINT "clinic_room_blocks_roomId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_item_approval_logs" DROP CONSTRAINT "clinical_item_approval_logs_itemId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_item_audit_logs" DROP CONSTRAINT "clinical_item_audit_logs_itemId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_item_branch_configs" DROP CONSTRAINT "clinical_item_branch_configs_branchId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_item_branch_configs" DROP CONSTRAINT "clinical_item_branch_configs_itemId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_item_categories" DROP CONSTRAINT "clinical_item_categories_masterCatalogCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_item_categories" DROP CONSTRAINT "clinical_item_categories_orgId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_item_categories" DROP CONSTRAINT "clinical_item_categories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_item_media" DROP CONSTRAINT "clinical_item_media_itemId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_item_variants" DROP CONSTRAINT "clinical_item_variants_itemId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_item_variants" DROP CONSTRAINT "clinical_item_variants_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_items" DROP CONSTRAINT "clinical_items_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_items" DROP CONSTRAINT "clinical_items_masterCatalogItemId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_items" DROP CONSTRAINT "clinical_items_orgId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_items" DROP CONSTRAINT "clinical_items_replacementItemId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_notes" DROP CONSTRAINT "clinical_notes_createdById_fkey";

-- DropForeignKey
ALTER TABLE "clinical_notes" DROP CONSTRAINT "clinical_notes_visitId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_audit_lines" DROP CONSTRAINT "clinical_stock_audit_lines_auditId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_audit_lines" DROP CONSTRAINT "clinical_stock_audit_lines_clinicalItemId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_audit_lines" DROP CONSTRAINT "clinical_stock_audit_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_audits" DROP CONSTRAINT "clinical_stock_audits_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_audits" DROP CONSTRAINT "clinical_stock_audits_branchId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_audits" DROP CONSTRAINT "clinical_stock_audits_initiatedById_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_audits" DROP CONSTRAINT "clinical_stock_audits_orgId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_ledger" DROP CONSTRAINT "clinical_stock_ledger_actorId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_ledger" DROP CONSTRAINT "clinical_stock_ledger_batchId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_ledger" DROP CONSTRAINT "clinical_stock_ledger_branchId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_ledger" DROP CONSTRAINT "clinical_stock_ledger_clinicalItemId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_ledger" DROP CONSTRAINT "clinical_stock_ledger_orgId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_ledger" DROP CONSTRAINT "clinical_stock_ledger_variantId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_transfer_items" DROP CONSTRAINT "clinical_stock_transfer_items_clinicalItemId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_transfer_items" DROP CONSTRAINT "clinical_stock_transfer_items_transferId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_transfer_items" DROP CONSTRAINT "clinical_stock_transfer_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_transfers" DROP CONSTRAINT "clinical_stock_transfers_fromBranchId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_transfers" DROP CONSTRAINT "clinical_stock_transfers_orgId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_transfers" DROP CONSTRAINT "clinical_stock_transfers_supplyRequestId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_stock_transfers" DROP CONSTRAINT "clinical_stock_transfers_toBranchId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_supply_request_items" DROP CONSTRAINT "clinical_supply_request_items_clinicalItemId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_supply_request_items" DROP CONSTRAINT "clinical_supply_request_items_requestId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_supply_request_items" DROP CONSTRAINT "clinical_supply_request_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_supply_request_status_history" DROP CONSTRAINT "clinical_supply_request_status_history_actorId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_supply_request_status_history" DROP CONSTRAINT "clinical_supply_request_status_history_requestId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_supply_requests" DROP CONSTRAINT "clinical_supply_requests_branchId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_supply_requests" DROP CONSTRAINT "clinical_supply_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_supply_requests" DROP CONSTRAINT "clinical_supply_requests_requestedById_fkey";

-- DropForeignKey
ALTER TABLE "clinical_supply_requests" DROP CONSTRAINT "clinical_supply_requests_reviewedById_fkey";

-- DropForeignKey
ALTER TABLE "clinical_wastage_logs" DROP CONSTRAINT "clinical_wastage_logs_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "clinical_wastage_logs" DROP CONSTRAINT "clinical_wastage_logs_branchId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_wastage_logs" DROP CONSTRAINT "clinical_wastage_logs_clinicalItemId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_wastage_logs" DROP CONSTRAINT "clinical_wastage_logs_orgId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_wastage_logs" DROP CONSTRAINT "clinical_wastage_logs_reportedById_fkey";

-- DropForeignKey
ALTER TABLE "clinical_wastage_logs" DROP CONSTRAINT "clinical_wastage_logs_variantId_fkey";

-- DropForeignKey
ALTER TABLE "commission_rules" DROP CONSTRAINT "commission_rules_orgId_fkey";

-- DropForeignKey
ALTER TABLE "complaint_cases" DROP CONSTRAINT "complaint_cases_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "consultation_templates" DROP CONSTRAINT "consultation_templates_branchId_fkey";

-- DropForeignKey
ALTER TABLE "consultation_templates" DROP CONSTRAINT "consultation_templates_orgId_fkey";

-- DropForeignKey
ALTER TABLE "consumable_item_profiles" DROP CONSTRAINT "consumable_item_profiles_itemId_fkey";

-- DropForeignKey
ALTER TABLE "consumption_items" DROP CONSTRAINT "consumption_items_batchId_fkey";

-- DropForeignKey
ALTER TABLE "consumption_items" DROP CONSTRAINT "consumption_items_clinicalItemId_fkey";

-- DropForeignKey
ALTER TABLE "consumption_items" DROP CONSTRAINT "consumption_items_clinicalItemVariantId_fkey";

-- DropForeignKey
ALTER TABLE "consumption_items" DROP CONSTRAINT "consumption_items_inventoryConsumptionId_fkey";

-- DropForeignKey
ALTER TABLE "consumption_items" DROP CONSTRAINT "consumption_items_lotId_fkey";

-- DropForeignKey
ALTER TABLE "consumption_items" DROP CONSTRAINT "consumption_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "consumption_items" DROP CONSTRAINT "consumption_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_orgId_fkey";

-- DropForeignKey
ALTER TABLE "cost_allocation_policies" DROP CONSTRAINT "cost_allocation_policies_orgId_fkey";

-- DropForeignKey
ALTER TABLE "cost_driver_inputs" DROP CONSTRAINT "cost_driver_inputs_branchId_fkey";

-- DropForeignKey
ALTER TABLE "cost_driver_inputs" DROP CONSTRAINT "cost_driver_inputs_orgId_fkey";

-- DropForeignKey
ALTER TABLE "cost_facts" DROP CONSTRAINT "cost_facts_branchId_fkey";

-- DropForeignKey
ALTER TABLE "cost_facts" DROP CONSTRAINT "cost_facts_costAllocationPolicyId_fkey";

-- DropForeignKey
ALTER TABLE "cost_facts" DROP CONSTRAINT "cost_facts_locationId_fkey";

-- DropForeignKey
ALTER TABLE "cost_facts" DROP CONSTRAINT "cost_facts_orgId_fkey";

-- DropForeignKey
ALTER TABLE "cost_facts" DROP CONSTRAINT "cost_facts_variantId_fkey";

-- DropForeignKey
ALTER TABLE "country_medicine_brands" DROP CONSTRAINT "country_medicine_brands_brandId_fkey";

-- DropForeignKey
ALTER TABLE "country_medicine_brands" DROP CONSTRAINT "country_medicine_brands_countryId_fkey";

-- DropForeignKey
ALTER TABLE "country_medicine_brands" DROP CONSTRAINT "country_medicine_brands_firstImportBatchId_fkey";

-- DropForeignKey
ALTER TABLE "country_medicine_brands" DROP CONSTRAINT "country_medicine_brands_lastImportBatchId_fkey";

-- DropForeignKey
ALTER TABLE "country_medicine_brands" DROP CONSTRAINT "country_medicine_brands_presentationId_fkey";

-- DropForeignKey
ALTER TABLE "cts_summaries" DROP CONSTRAINT "cts_summaries_branchId_fkey";

-- DropForeignKey
ALTER TABLE "cts_summaries" DROP CONSTRAINT "cts_summaries_orgId_fkey";

-- DropForeignKey
ALTER TABLE "cts_summaries" DROP CONSTRAINT "cts_summaries_variantId_fkey";

-- DropForeignKey
ALTER TABLE "daily_medicine_variances" DROP CONSTRAINT "daily_medicine_variances_branchId_fkey";

-- DropForeignKey
ALTER TABLE "daily_medicine_variances" DROP CONSTRAINT "daily_medicine_variances_variantId_fkey";

-- DropForeignKey
ALTER TABLE "daily_reconciliations" DROP CONSTRAINT "daily_reconciliations_branchId_fkey";

-- DropForeignKey
ALTER TABLE "daily_reconciliations" DROP CONSTRAINT "daily_reconciliations_reconciledByUserId_fkey";

-- DropForeignKey
ALTER TABLE "decision_approval_events" DROP CONSTRAINT "decision_approval_events_actorUserId_fkey";

-- DropForeignKey
ALTER TABLE "decision_approval_events" DROP CONSTRAINT "decision_approval_events_decisionPackageId_fkey";

-- DropForeignKey
ALTER TABLE "decision_package_items" DROP CONSTRAINT "decision_package_items_decisionPackageId_fkey";

-- DropForeignKey
ALTER TABLE "decision_packages" DROP CONSTRAINT "decision_packages_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "decision_packages" DROP CONSTRAINT "decision_packages_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "decision_packages" DROP CONSTRAINT "decision_packages_orgId_fkey";

-- DropForeignKey
ALTER TABLE "delivery_assignments" DROP CONSTRAINT "delivery_assignments_assignedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "delivery_assignments" DROP CONSTRAINT "delivery_assignments_assignedToUserId_fkey";

-- DropForeignKey
ALTER TABLE "delivery_assignments" DROP CONSTRAINT "delivery_assignments_dispatchId_fkey";

-- DropForeignKey
ALTER TABLE "destruction_records" DROP CONSTRAINT "destruction_records_auditBinId_fkey";

-- DropForeignKey
ALTER TABLE "destruction_records" DROP CONSTRAINT "destruction_records_destroyedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "destruction_records" DROP CONSTRAINT "destruction_records_witnessUserId_fkey";

-- DropForeignKey
ALTER TABLE "discount_approval_rules" DROP CONSTRAINT "discount_approval_rules_branchId_fkey";

-- DropForeignKey
ALTER TABLE "discount_approval_rules" DROP CONSTRAINT "discount_approval_rules_orgId_fkey";

-- DropForeignKey
ALTER TABLE "discount_audit_logs" DROP CONSTRAINT "discount_audit_logs_branchId_fkey";

-- DropForeignKey
ALTER TABLE "discount_policies" DROP CONSTRAINT "discount_policies_branchId_fkey";

-- DropForeignKey
ALTER TABLE "discount_policies" DROP CONSTRAINT "discount_policies_orgId_fkey";

-- DropForeignKey
ALTER TABLE "dispatch_receive_session_lines" DROP CONSTRAINT "dispatch_receive_session_lines_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "dispatch_receive_session_lines" DROP CONSTRAINT "dispatch_receive_session_lines_stockDispatchItemId_fkey";

-- DropForeignKey
ALTER TABLE "dispatch_receive_sessions" DROP CONSTRAINT "dispatch_receive_sessions_confirmedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "dispatch_receive_sessions" DROP CONSTRAINT "dispatch_receive_sessions_orgId_fkey";

-- DropForeignKey
ALTER TABLE "dispatch_receive_sessions" DROP CONSTRAINT "dispatch_receive_sessions_stockDispatchId_fkey";

-- DropForeignKey
ALTER TABLE "dispatch_receive_sessions" DROP CONSTRAINT "dispatch_receive_sessions_submittedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "dispatch_receive_sessions" DROP CONSTRAINT "dispatch_receive_sessions_verifiedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_request_items" DROP CONSTRAINT "dispense_request_items_clinicalItemVariantId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_request_items" DROP CONSTRAINT "dispense_request_items_dispenseRequestId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_request_items" DROP CONSTRAINT "dispense_request_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_request_items" DROP CONSTRAINT "dispense_request_items_vialInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_requests" DROP CONSTRAINT "dispense_requests_branchId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_requests" DROP CONSTRAINT "dispense_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_requests" DROP CONSTRAINT "dispense_requests_patientId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_requests" DROP CONSTRAINT "dispense_requests_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_requests" DROP CONSTRAINT "dispense_requests_receivedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_requests" DROP CONSTRAINT "dispense_requests_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_requests" DROP CONSTRAINT "dispense_requests_surgeryCaseId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_requests" DROP CONSTRAINT "dispense_requests_tokenId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_requests" DROP CONSTRAINT "dispense_requests_treatmentDayItemId_fkey";

-- DropForeignKey
ALTER TABLE "dispense_requests" DROP CONSTRAINT "dispense_requests_visitId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_audit_logs" DROP CONSTRAINT "doctor_audit_logs_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_audit_logs" DROP CONSTRAINT "doctor_audit_logs_clinicStaffProfileId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_audit_logs" DROP CONSTRAINT "doctor_audit_logs_orgId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_contract_rules" DROP CONSTRAINT "doctor_contract_rules_doctorContractId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_contract_rules" DROP CONSTRAINT "doctor_contract_rules_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_contracts" DROP CONSTRAINT "doctor_contracts_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_contracts" DROP CONSTRAINT "doctor_contracts_clinicStaffProfileId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_credentials" DROP CONSTRAINT "doctor_credentials_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_credentials" DROP CONSTRAINT "doctor_credentials_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_credentials" DROP CONSTRAINT "doctor_credentials_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "doctor_leave_requests" DROP CONSTRAINT "doctor_leave_requests_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_leave_requests" DROP CONSTRAINT "doctor_leave_requests_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_leave_requests" DROP CONSTRAINT "doctor_leave_requests_clinicStaffProfileId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_leave_requests" DROP CONSTRAINT "doctor_leave_requests_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_licenses" DROP CONSTRAINT "doctor_licenses_doctorVerificationId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_licenses" DROP CONSTRAINT "doctor_licenses_regulatoryBodyId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_package_mappings" DROP CONSTRAINT "doctor_package_mappings_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_package_mappings" DROP CONSTRAINT "doctor_package_mappings_clinicStaffProfileId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_package_mappings" DROP CONSTRAINT "doctor_package_mappings_surgeryPackageId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_requests" DROP CONSTRAINT "doctor_requests_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_requests" DROP CONSTRAINT "doctor_requests_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_requests" DROP CONSTRAINT "doctor_requests_doctorUserId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedule_exceptions" DROP CONSTRAINT "doctor_schedule_exceptions_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedule_exceptions" DROP CONSTRAINT "doctor_schedule_exceptions_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedule_exceptions" DROP CONSTRAINT "doctor_schedule_exceptions_orgId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedule_proposals" DROP CONSTRAINT "doctor_schedule_proposals_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedule_proposals" DROP CONSTRAINT "doctor_schedule_proposals_branchMemberId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedule_proposals" DROP CONSTRAINT "doctor_schedule_proposals_orgId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedule_templates" DROP CONSTRAINT "doctor_schedule_templates_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedule_templates" DROP CONSTRAINT "doctor_schedule_templates_branchMemberId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedule_templates" DROP CONSTRAINT "doctor_schedule_templates_orgId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_service_assignment_templates" DROP CONSTRAINT "doctor_service_assignment_templates_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_service_fee_change_logs" DROP CONSTRAINT "doctor_service_fee_change_logs_doctorServiceFeeId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_service_fees" DROP CONSTRAINT "doctor_service_fees_clinicStaffProfileId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_service_fees" DROP CONSTRAINT "doctor_service_fees_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_service_mappings" DROP CONSTRAINT "doctor_service_mappings_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_service_mappings" DROP CONSTRAINT "doctor_service_mappings_clinicStaffProfileId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_service_mappings" DROP CONSTRAINT "doctor_service_mappings_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_settlement_batches" DROP CONSTRAINT "doctor_settlement_batches_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_settlement_batches" DROP CONSTRAINT "doctor_settlement_batches_clinicStaffProfileId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_settlement_batches" DROP CONSTRAINT "doctor_settlement_batches_contractId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_settlement_batches" DROP CONSTRAINT "doctor_settlement_batches_orgId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_settlement_ledger" DROP CONSTRAINT "doctor_settlement_ledger_batchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_settlement_ledger" DROP CONSTRAINT "doctor_settlement_ledger_branchId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_settlement_ledger" DROP CONSTRAINT "doctor_settlement_ledger_caseId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_settlement_ledger" DROP CONSTRAINT "doctor_settlement_ledger_clinicStaffProfileId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_settlement_ledger" DROP CONSTRAINT "doctor_settlement_ledger_contractId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_settlement_ledger" DROP CONSTRAINT "doctor_settlement_ledger_orgId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_settlement_ledger" DROP CONSTRAINT "doctor_settlement_ledger_packageId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_settlement_ledger" DROP CONSTRAINT "doctor_settlement_ledger_surgeryCaseId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_verification_documents" DROP CONSTRAINT "doctor_verification_documents_doctorLicenseId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_verification_documents" DROP CONSTRAINT "doctor_verification_documents_doctorVerificationId_fkey";

-- DropForeignKey
ALTER TABLE "enforcement_actions" DROP CONSTRAINT "enforcement_actions_caseId_fkey";

-- DropForeignKey
ALTER TABLE "enterprise_discount_rules" DROP CONSTRAINT "enterprise_discount_rules_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "enterprise_discount_rules" DROP CONSTRAINT "enterprise_discount_rules_orgId_fkey";

-- DropForeignKey
ALTER TABLE "enterprise_discount_rules" DROP CONSTRAINT "enterprise_discount_rules_scopeBranchId_fkey";

-- DropForeignKey
ALTER TABLE "exception_severity_rules" DROP CONSTRAINT "exception_severity_rules_orgId_fkey";

-- DropForeignKey
ALTER TABLE "expiry_write_off_logs" DROP CONSTRAINT "expiry_write_off_logs_createdById_fkey";

-- DropForeignKey
ALTER TABLE "expiry_write_off_logs" DROP CONSTRAINT "expiry_write_off_logs_ledgerId_fkey";

-- DropForeignKey
ALTER TABLE "expiry_write_off_logs" DROP CONSTRAINT "expiry_write_off_logs_locationId_fkey";

-- DropForeignKey
ALTER TABLE "expiry_write_off_logs" DROP CONSTRAINT "expiry_write_off_logs_lotId_fkey";

-- DropForeignKey
ALTER TABLE "expiry_write_off_logs" DROP CONSTRAINT "expiry_write_off_logs_orgId_fkey";

-- DropForeignKey
ALTER TABLE "expiry_write_off_logs" DROP CONSTRAINT "expiry_write_off_logs_variantId_fkey";

-- DropForeignKey
ALTER TABLE "factories" DROP CONSTRAINT "factories_orgId_fkey";

-- DropForeignKey
ALTER TABLE "governance_incidents" DROP CONSTRAINT "governance_incidents_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "grn_lines" DROP CONSTRAINT "grn_lines_grnId_fkey";

-- DropForeignKey
ALTER TABLE "grn_lines" DROP CONSTRAINT "grn_lines_inboundShipmentLineId_fkey";

-- DropForeignKey
ALTER TABLE "grn_lines" DROP CONSTRAINT "grn_lines_lotId_fkey";

-- DropForeignKey
ALTER TABLE "grn_lines" DROP CONSTRAINT "grn_lines_purchaseOrderLineId_fkey";

-- DropForeignKey
ALTER TABLE "grn_lines" DROP CONSTRAINT "grn_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "grns" DROP CONSTRAINT "grns_inboundShipmentId_fkey";

-- DropForeignKey
ALTER TABLE "grns" DROP CONSTRAINT "grns_locationId_fkey";

-- DropForeignKey
ALTER TABLE "grns" DROP CONSTRAINT "grns_orgId_fkey";

-- DropForeignKey
ALTER TABLE "grns" DROP CONSTRAINT "grns_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "grns" DROP CONSTRAINT "grns_receivedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "grns" DROP CONSTRAINT "grns_stockDispatchId_fkey";

-- DropForeignKey
ALTER TABLE "grns" DROP CONSTRAINT "grns_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "grns" DROP CONSTRAINT "grns_voidedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_discrepancies" DROP CONSTRAINT "inbound_discrepancies_grnId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_discrepancies" DROP CONSTRAINT "inbound_discrepancies_grnLineId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_discrepancies" DROP CONSTRAINT "inbound_discrepancies_orgId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_discrepancies" DROP CONSTRAINT "inbound_discrepancies_purchaseOrderLineId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_discrepancies" DROP CONSTRAINT "inbound_discrepancies_resolvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_discrepancies" DROP CONSTRAINT "inbound_discrepancies_variantId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_shipment_lines" DROP CONSTRAINT "inbound_shipment_lines_inboundShipmentId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_shipment_lines" DROP CONSTRAINT "inbound_shipment_lines_purchaseOrderLineId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_shipment_lines" DROP CONSTRAINT "inbound_shipment_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_shipments" DROP CONSTRAINT "inbound_shipments_orgId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_shipments" DROP CONSTRAINT "inbound_shipments_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_shipments" DROP CONSTRAINT "inbound_shipments_shipToWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "inbound_shipments" DROP CONSTRAINT "inbound_shipments_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "injection_token_medication_lines" DROP CONSTRAINT "injection_token_medication_lines_injectionTokenId_fkey";

-- DropForeignKey
ALTER TABLE "injection_token_medication_lines" DROP CONSTRAINT "injection_token_medication_lines_selectedVialSessionId_fkey";

-- DropForeignKey
ALTER TABLE "injection_token_medication_lines" DROP CONSTRAINT "injection_token_medication_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_branchId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_cancelledByUserId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_generatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_orderId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_patientId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_petId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_selectedVialSessionId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_treatmentCourseId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_treatmentDayId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_usedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_validatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_variantId_fkey";

-- DropForeignKey
ALTER TABLE "injection_tokens" DROP CONSTRAINT "injection_tokens_visitId_fkey";

-- DropForeignKey
ALTER TABLE "instrument_instances" DROP CONSTRAINT "instrument_instances_branchId_fkey";

-- DropForeignKey
ALTER TABLE "instrument_instances" DROP CONSTRAINT "instrument_instances_clinicalItemId_fkey";

-- DropForeignKey
ALTER TABLE "instrument_instances" DROP CONSTRAINT "instrument_instances_orgId_fkey";

-- DropForeignKey
ALTER TABLE "instrument_issue_logs" DROP CONSTRAINT "instrument_issue_logs_branchId_fkey";

-- DropForeignKey
ALTER TABLE "instrument_item_profiles" DROP CONSTRAINT "instrument_item_profiles_itemId_fkey";

-- DropForeignKey
ALTER TABLE "integration_mappings" DROP CONSTRAINT "integration_mappings_orgId_fkey";

-- DropForeignKey
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_branchId_fkey";

-- DropForeignKey
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_variantId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_consumptions" DROP CONSTRAINT "inventory_consumptions_clinicalCaseId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_consumptions" DROP CONSTRAINT "inventory_consumptions_procedureOrderId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_consumptions" DROP CONSTRAINT "inventory_consumptions_surgeryCaseId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_consumptions" DROP CONSTRAINT "inventory_consumptions_visitId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_variance_logs" DROP CONSTRAINT "inventory_variance_logs_inventoryConsumptionId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_variance_logs" DROP CONSTRAINT "inventory_variance_logs_variantId_fkey";

-- DropForeignKey
ALTER TABLE "invoice_cost_sheets" DROP CONSTRAINT "invoice_cost_sheets_clinicInvoiceId_fkey";

-- DropForeignKey
ALTER TABLE "lab_report_items" DROP CONSTRAINT "lab_report_items_labReportId_fkey";

-- DropForeignKey
ALTER TABLE "lab_reports" DROP CONSTRAINT "lab_reports_requisitionId_fkey";

-- DropForeignKey
ALTER TABLE "lab_requisitions" DROP CONSTRAINT "lab_requisitions_visitId_fkey";

-- DropForeignKey
ALTER TABLE "location_prices" DROP CONSTRAINT "location_prices_locationId_fkey";

-- DropForeignKey
ALTER TABLE "location_prices" DROP CONSTRAINT "location_prices_variantId_fkey";

-- DropForeignKey
ALTER TABLE "location_variant_configs" DROP CONSTRAINT "location_variant_configs_locationId_fkey";

-- DropForeignKey
ALTER TABLE "location_variant_configs" DROP CONSTRAINT "location_variant_configs_variantId_fkey";

-- DropForeignKey
ALTER TABLE "manager_approval_escalations" DROP CONSTRAINT "manager_approval_escalations_branchId_fkey";

-- DropForeignKey
ALTER TABLE "manager_approval_escalations" DROP CONSTRAINT "manager_approval_escalations_decidedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "manager_approval_escalations" DROP CONSTRAINT "manager_approval_escalations_orgId_fkey";

-- DropForeignKey
ALTER TABLE "manager_approval_escalations" DROP CONSTRAINT "manager_approval_escalations_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "master_clinical_catalog_categories" DROP CONSTRAINT "master_clinical_catalog_categories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "master_clinical_catalog_items" DROP CONSTRAINT "master_clinical_catalog_items_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "master_product_catalog" DROP CONSTRAINT "master_product_catalog_brandId_fkey";

-- DropForeignKey
ALTER TABLE "master_product_catalog" DROP CONSTRAINT "master_product_catalog_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "master_product_catalog" DROP CONSTRAINT "master_product_catalog_companyId_fkey";

-- DropForeignKey
ALTER TABLE "master_product_catalog" DROP CONSTRAINT "master_product_catalog_primaryMediaId_fkey";

-- DropForeignKey
ALTER TABLE "master_product_media" DROP CONSTRAINT "master_product_media_masterId_fkey";

-- DropForeignKey
ALTER TABLE "master_product_media" DROP CONSTRAINT "master_product_media_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "master_product_variants" DROP CONSTRAINT "master_product_variants_masterId_fkey";

-- DropForeignKey
ALTER TABLE "medication_administrations" DROP CONSTRAINT "medication_administrations_administeredByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medication_administrations" DROP CONSTRAINT "medication_administrations_injectionTokenId_fkey";

-- DropForeignKey
ALTER TABLE "medication_administrations" DROP CONSTRAINT "medication_administrations_medicineApprovalRequestId_fkey";

-- DropForeignKey
ALTER TABLE "medication_administrations" DROP CONSTRAINT "medication_administrations_patientId_fkey";

-- DropForeignKey
ALTER TABLE "medication_administrations" DROP CONSTRAINT "medication_administrations_surgeryCaseId_fkey";

-- DropForeignKey
ALTER TABLE "medication_administrations" DROP CONSTRAINT "medication_administrations_treatmentCourseId_fkey";

-- DropForeignKey
ALTER TABLE "medication_administrations" DROP CONSTRAINT "medication_administrations_treatmentDayItemId_fkey";

-- DropForeignKey
ALTER TABLE "medication_administrations" DROP CONSTRAINT "medication_administrations_variantId_fkey";

-- DropForeignKey
ALTER TABLE "medication_administrations" DROP CONSTRAINT "medication_administrations_vialSessionId_fkey";

-- DropForeignKey
ALTER TABLE "medication_administrations" DROP CONSTRAINT "medication_administrations_visitId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_approval_actions" DROP CONSTRAINT "medicine_approval_actions_actionByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_approval_actions" DROP CONSTRAINT "medicine_approval_actions_approvalRequestId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_approval_requests" DROP CONSTRAINT "medicine_approval_requests_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_approval_requests" DROP CONSTRAINT "medicine_approval_requests_branchId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_approval_requests" DROP CONSTRAINT "medicine_approval_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_approval_requests" DROP CONSTRAINT "medicine_approval_requests_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_brands" DROP CONSTRAINT "medicine_brands_manufacturerId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_control_day_closes" DROP CONSTRAINT "medicine_control_day_closes_branchId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_control_day_closes" DROP CONSTRAINT "medicine_control_day_closes_closedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_discrepancies" DROP CONSTRAINT "medicine_discrepancies_branchId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_discrepancies" DROP CONSTRAINT "medicine_discrepancies_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_discrepancies" DROP CONSTRAINT "medicine_discrepancies_variantId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_import_batches" DROP CONSTRAINT "medicine_import_batches_appliedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_import_batches" DROP CONSTRAINT "medicine_import_batches_confirmedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_import_batches" DROP CONSTRAINT "medicine_import_batches_countryId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_import_batches" DROP CONSTRAINT "medicine_import_batches_uploadedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_import_entity_touches" DROP CONSTRAINT "medicine_import_entity_touches_batchId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_import_rows" DROP CONSTRAINT "medicine_import_rows_batchId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_import_rows" DROP CONSTRAINT "medicine_import_rows_countryMedicineBrandId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_incidents" DROP CONSTRAINT "medicine_incidents_assignedToUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_incidents" DROP CONSTRAINT "medicine_incidents_branchId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_incidents" DROP CONSTRAINT "medicine_incidents_orgId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_item_profiles" DROP CONSTRAINT "medicine_item_profiles_itemId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_master_audit_logs" DROP CONSTRAINT "medicine_master_audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_policies" DROP CONSTRAINT "medicine_policies_orgId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_policies" DROP CONSTRAINT "medicine_policies_variantId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_presentations" DROP CONSTRAINT "medicine_presentations_dosageFormId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_presentations" DROP CONSTRAINT "medicine_presentations_genericId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisition_items" DROP CONSTRAINT "medicine_requisition_items_medicineListingId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisition_items" DROP CONSTRAINT "medicine_requisition_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisition_items" DROP CONSTRAINT "medicine_requisition_items_requisitionId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisition_items" DROP CONSTRAINT "medicine_requisition_items_substitutedListingId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisition_items" DROP CONSTRAINT "medicine_requisition_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisition_timeline" DROP CONSTRAINT "medicine_requisition_timeline_performedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisition_timeline" DROP CONSTRAINT "medicine_requisition_timeline_requisitionId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisitions" DROP CONSTRAINT "medicine_requisitions_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisitions" DROP CONSTRAINT "medicine_requisitions_branchId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisitions" DROP CONSTRAINT "medicine_requisitions_cancelledByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisitions" DROP CONSTRAINT "medicine_requisitions_orgId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisitions" DROP CONSTRAINT "medicine_requisitions_rejectedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisitions" DROP CONSTRAINT "medicine_requisitions_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisitions" DROP CONSTRAINT "medicine_requisitions_reviewedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisitions" DROP CONSTRAINT "medicine_requisitions_stockDispatchId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_requisitions" DROP CONSTRAINT "medicine_requisitions_stockTransferId_fkey";

-- DropForeignKey
ALTER TABLE "membership_tier_branch_scopes" DROP CONSTRAINT "membership_tier_branch_scopes_branchId_fkey";

-- DropForeignKey
ALTER TABLE "membership_tier_branch_scopes" DROP CONSTRAINT "membership_tier_branch_scopes_tierId_fkey";

-- DropForeignKey
ALTER TABLE "membership_tier_exclusions" DROP CONSTRAINT "membership_tier_exclusions_tierId_fkey";

-- DropForeignKey
ALTER TABLE "membership_tiers" DROP CONSTRAINT "membership_tiers_orgId_fkey";

-- DropForeignKey
ALTER TABLE "network_balance_snapshots" DROP CONSTRAINT "network_balance_snapshots_branchId_fkey";

-- DropForeignKey
ALTER TABLE "network_balance_snapshots" DROP CONSTRAINT "network_balance_snapshots_orgId_fkey";

-- DropForeignKey
ALTER TABLE "network_transfer_recommendations" DROP CONSTRAINT "network_transfer_recommendations_acceptedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "network_transfer_recommendations" DROP CONSTRAINT "network_transfer_recommendations_dismissedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "network_transfer_recommendations" DROP CONSTRAINT "network_transfer_recommendations_fromLocationId_fkey";

-- DropForeignKey
ALTER TABLE "network_transfer_recommendations" DROP CONSTRAINT "network_transfer_recommendations_lotId_fkey";

-- DropForeignKey
ALTER TABLE "network_transfer_recommendations" DROP CONSTRAINT "network_transfer_recommendations_orgId_fkey";

-- DropForeignKey
ALTER TABLE "network_transfer_recommendations" DROP CONSTRAINT "network_transfer_recommendations_toLocationId_fkey";

-- DropForeignKey
ALTER TABLE "network_transfer_recommendations" DROP CONSTRAINT "network_transfer_recommendations_variantId_fkey";

-- DropForeignKey
ALTER TABLE "network_transfer_routes" DROP CONSTRAINT "network_transfer_routes_orgId_fkey";

-- DropForeignKey
ALTER TABLE "operational_exception_indices" DROP CONSTRAINT "operational_exception_indices_assignedToUserId_fkey";

-- DropForeignKey
ALTER TABLE "operational_exception_indices" DROP CONSTRAINT "operational_exception_indices_branchId_fkey";

-- DropForeignKey
ALTER TABLE "operational_exception_indices" DROP CONSTRAINT "operational_exception_indices_orgId_fkey";

-- DropForeignKey
ALTER TABLE "operational_exception_rcas" DROP CONSTRAINT "operational_exception_rcas_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "operational_exception_rcas" DROP CONSTRAINT "operational_exception_rcas_operationalExceptionId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_retailDiscountApprovalRequestId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "org_directors" DROP CONSTRAINT "org_directors_nidBackMediaId_fkey";

-- DropForeignKey
ALTER TABLE "org_directors" DROP CONSTRAINT "org_directors_nidFrontMediaId_fkey";

-- DropForeignKey
ALTER TABLE "org_directors" DROP CONSTRAINT "org_directors_orgLegalProfileId_fkey";

-- DropForeignKey
ALTER TABLE "org_directors" DROP CONSTRAINT "org_directors_signatureMediaId_fkey";

-- DropForeignKey
ALTER TABLE "org_documents" DROP CONSTRAINT "org_documents_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "org_documents" DROP CONSTRAINT "org_documents_orgLegalProfileId_fkey";

-- DropForeignKey
ALTER TABLE "org_feature_flags" DROP CONSTRAINT "org_feature_flags_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "org_feature_flags" DROP CONSTRAINT "org_feature_flags_updatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "org_member_roles" DROP CONSTRAINT "org_member_roles_orgMemberId_fkey";

-- DropForeignKey
ALTER TABLE "org_member_roles" DROP CONSTRAINT "org_member_roles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "org_members" DROP CONSTRAINT "org_members_invitedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "org_members" DROP CONSTRAINT "org_members_orgId_fkey";

-- DropForeignKey
ALTER TABLE "org_members" DROP CONSTRAINT "org_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "org_quotas" DROP CONSTRAINT "org_quotas_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "org_quotas" DROP CONSTRAINT "org_quotas_updatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "outside_medicine_receives" DROP CONSTRAINT "outside_medicine_receives_branchId_fkey";

-- DropForeignKey
ALTER TABLE "outside_medicine_receives" DROP CONSTRAINT "outside_medicine_receives_receivedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "outside_medicine_receives" DROP CONSTRAINT "outside_medicine_receives_variantId_fkey";

-- DropForeignKey
ALTER TABLE "owner_delegations" DROP CONSTRAINT "owner_delegations_branchId_fkey";

-- DropForeignKey
ALTER TABLE "owner_delegations" DROP CONSTRAINT "owner_delegations_delegatedUserId_fkey";

-- DropForeignKey
ALTER TABLE "owner_delegations" DROP CONSTRAINT "owner_delegations_orgId_fkey";

-- DropForeignKey
ALTER TABLE "owner_delegations" DROP CONSTRAINT "owner_delegations_ownerUserId_fkey";

-- DropForeignKey
ALTER TABLE "owner_delegations" DROP CONSTRAINT "owner_delegations_teamId_fkey";

-- DropForeignKey
ALTER TABLE "owner_discount_cards" DROP CONSTRAINT "owner_discount_cards_branchId_fkey";

-- DropForeignKey
ALTER TABLE "owner_discount_cards" DROP CONSTRAINT "owner_discount_cards_issuedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "owner_discount_cards" DROP CONSTRAINT "owner_discount_cards_membershipTierId_fkey";

-- DropForeignKey
ALTER TABLE "owner_discount_cards" DROP CONSTRAINT "owner_discount_cards_orgId_fkey";

-- DropForeignKey
ALTER TABLE "owner_discount_cards" DROP CONSTRAINT "owner_discount_cards_userId_fkey";

-- DropForeignKey
ALTER TABLE "owner_overview_logs" DROP CONSTRAINT "owner_overview_logs_actorUserId_fkey";

-- DropForeignKey
ALTER TABLE "owner_overview_logs" DROP CONSTRAINT "owner_overview_logs_ownerUserId_fkey";

-- DropForeignKey
ALTER TABLE "owner_team_members" DROP CONSTRAINT "owner_team_members_teamId_fkey";

-- DropForeignKey
ALTER TABLE "owner_team_members" DROP CONSTRAINT "owner_team_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "owner_teams" DROP CONSTRAINT "owner_teams_ownerUserId_fkey";

-- DropForeignKey
ALTER TABLE "package_audit_logs" DROP CONSTRAINT "package_audit_logs_surgeryPackageId_fkey";

-- DropForeignKey
ALTER TABLE "package_audit_logs" DROP CONSTRAINT "package_audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "package_items" DROP CONSTRAINT "package_items_clinicalItemId_fkey";

-- DropForeignKey
ALTER TABLE "package_items" DROP CONSTRAINT "package_items_clinicalItemVariantId_fkey";

-- DropForeignKey
ALTER TABLE "package_items" DROP CONSTRAINT "package_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "package_items" DROP CONSTRAINT "package_items_surgeryPackageId_fkey";

-- DropForeignKey
ALTER TABLE "package_items" DROP CONSTRAINT "package_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "package_price_change_logs" DROP CONSTRAINT "package_price_change_logs_changedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "package_price_change_logs" DROP CONSTRAINT "package_price_change_logs_surgeryPackageId_fkey";

-- DropForeignKey
ALTER TABLE "package_price_rules" DROP CONSTRAINT "package_price_rules_branchId_fkey";

-- DropForeignKey
ALTER TABLE "package_price_rules" DROP CONSTRAINT "package_price_rules_surgeryPackageId_fkey";

-- DropForeignKey
ALTER TABLE "packaging_templates" DROP CONSTRAINT "packaging_templates_productVersionId_fkey";

-- DropForeignKey
ALTER TABLE "partner_applications" DROP CONSTRAINT "partner_applications_userId_fkey";

-- DropForeignKey
ALTER TABLE "pick_list_lines" DROP CONSTRAINT "pick_list_lines_allocationPlanLineId_fkey";

-- DropForeignKey
ALTER TABLE "pick_list_lines" DROP CONSTRAINT "pick_list_lines_locationId_fkey";

-- DropForeignKey
ALTER TABLE "pick_list_lines" DROP CONSTRAINT "pick_list_lines_lotId_fkey";

-- DropForeignKey
ALTER TABLE "pick_list_lines" DROP CONSTRAINT "pick_list_lines_pickListId_fkey";

-- DropForeignKey
ALTER TABLE "pick_list_lines" DROP CONSTRAINT "pick_list_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "pick_lists" DROP CONSTRAINT "pick_lists_allocationPlanId_fkey";

-- DropForeignKey
ALTER TABLE "pick_lists" DROP CONSTRAINT "pick_lists_assignedPickerUserId_fkey";

-- DropForeignKey
ALTER TABLE "pick_lists" DROP CONSTRAINT "pick_lists_fromLocationId_fkey";

-- DropForeignKey
ALTER TABLE "pick_lists" DROP CONSTRAINT "pick_lists_orgId_fkey";

-- DropForeignKey
ALTER TABLE "pick_lists" DROP CONSTRAINT "pick_lists_stockDispatchId_fkey";

-- DropForeignKey
ALTER TABLE "pos_cart_lines" DROP CONSTRAINT "pos_cart_lines_cartId_fkey";

-- DropForeignKey
ALTER TABLE "pos_cart_lines" DROP CONSTRAINT "pos_cart_lines_productId_fkey";

-- DropForeignKey
ALTER TABLE "pos_cart_lines" DROP CONSTRAINT "pos_cart_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "pos_carts" DROP CONSTRAINT "pos_carts_branchId_fkey";

-- DropForeignKey
ALTER TABLE "pos_carts" DROP CONSTRAINT "pos_carts_customerUserId_fkey";

-- DropForeignKey
ALTER TABLE "pos_carts" DROP CONSTRAINT "pos_carts_ownerDiscountCardId_fkey";

-- DropForeignKey
ALTER TABLE "pos_carts" DROP CONSTRAINT "pos_carts_posShiftId_fkey";

-- DropForeignKey
ALTER TABLE "pos_carts" DROP CONSTRAINT "pos_carts_staffUserId_fkey";

-- DropForeignKey
ALTER TABLE "pos_credit_notes" DROP CONSTRAINT "pos_credit_notes_returnRequestId_fkey";

-- DropForeignKey
ALTER TABLE "prescription_items" DROP CONSTRAINT "prescription_items_clinicalItemVariantId_fkey";

-- DropForeignKey
ALTER TABLE "prescription_items" DROP CONSTRAINT "prescription_items_countryMedicineBrandId_fkey";

-- DropForeignKey
ALTER TABLE "prescription_items" DROP CONSTRAINT "prescription_items_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_petId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_visitId_fkey";

-- DropForeignKey
ALTER TABLE "price_approval_matrix_rows" DROP CONSTRAINT "price_approval_matrix_rows_orgId_fkey";

-- DropForeignKey
ALTER TABLE "price_change_approval_requests" DROP CONSTRAINT "price_change_approval_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "price_change_approval_requests" DROP CONSTRAINT "price_change_approval_requests_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "price_change_approval_requests" DROP CONSTRAINT "price_change_approval_requests_reviewedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "price_change_approval_requests" DROP CONSTRAINT "price_change_approval_requests_variantId_fkey";

-- DropForeignKey
ALTER TABLE "price_resolution_snapshots" DROP CONSTRAINT "price_resolution_snapshots_orderId_fkey";

-- DropForeignKey
ALTER TABLE "price_resolution_snapshots" DROP CONSTRAINT "price_resolution_snapshots_variantId_fkey";

-- DropForeignKey
ALTER TABLE "price_schedules" DROP CONSTRAINT "price_schedules_branchId_fkey";

-- DropForeignKey
ALTER TABLE "price_schedules" DROP CONSTRAINT "price_schedules_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "price_schedules" DROP CONSTRAINT "price_schedules_orgId_fkey";

-- DropForeignKey
ALTER TABLE "price_schedules" DROP CONSTRAINT "price_schedules_variantId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_audit_logs" DROP CONSTRAINT "pricing_audit_logs_actorUserId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_audit_logs" DROP CONSTRAINT "pricing_audit_logs_orgId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_campaign_scopes" DROP CONSTRAINT "pricing_campaign_scopes_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_campaigns" DROP CONSTRAINT "pricing_campaigns_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_campaigns" DROP CONSTRAINT "pricing_campaigns_orgId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_emergency_overrides" DROP CONSTRAINT "pricing_emergency_overrides_branchId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_emergency_overrides" DROP CONSTRAINT "pricing_emergency_overrides_consumedOrderId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_emergency_overrides" DROP CONSTRAINT "pricing_emergency_overrides_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_emergency_overrides" DROP CONSTRAINT "pricing_emergency_overrides_orgId_fkey";

-- DropForeignKey
ALTER TABLE "pricing_emergency_overrides" DROP CONSTRAINT "pricing_emergency_overrides_variantId_fkey";

-- DropForeignKey
ALTER TABLE "procedure_orders" DROP CONSTRAINT "procedure_orders_clinicalCaseId_fkey";

-- DropForeignKey
ALTER TABLE "procedure_orders" DROP CONSTRAINT "procedure_orders_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "procedure_orders" DROP CONSTRAINT "procedure_orders_surgeryPackageId_fkey";

-- DropForeignKey
ALTER TABLE "procurement_demand_lines" DROP CONSTRAINT "procurement_demand_lines_allocationPlanId_fkey";

-- DropForeignKey
ALTER TABLE "procurement_demand_lines" DROP CONSTRAINT "procurement_demand_lines_allocationPlanLineId_fkey";

-- DropForeignKey
ALTER TABLE "procurement_demand_lines" DROP CONSTRAINT "procurement_demand_lines_fulfillmentDispatchId_fkey";

-- DropForeignKey
ALTER TABLE "procurement_demand_lines" DROP CONSTRAINT "procurement_demand_lines_orgId_fkey";

-- DropForeignKey
ALTER TABLE "procurement_demand_lines" DROP CONSTRAINT "procurement_demand_lines_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "procurement_demand_lines" DROP CONSTRAINT "procurement_demand_lines_purchaseOrderLineId_fkey";

-- DropForeignKey
ALTER TABLE "procurement_demand_lines" DROP CONSTRAINT "procurement_demand_lines_stockRequestId_fkey";

-- DropForeignKey
ALTER TABLE "procurement_demand_lines" DROP CONSTRAINT "procurement_demand_lines_stockRequestItemId_fkey";

-- DropForeignKey
ALTER TABLE "procurement_demand_lines" DROP CONSTRAINT "procurement_demand_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "producer_approvals" DROP CONSTRAINT "producer_approvals_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "producer_audit_logs" DROP CONSTRAINT "producer_audit_logs_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "producer_email_recipients" DROP CONSTRAINT "producer_email_recipients_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "producer_email_recipients" DROP CONSTRAINT "producer_email_recipients_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "producer_factories" DROP CONSTRAINT "producer_factories_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "producer_org_documents" DROP CONSTRAINT "producer_org_documents_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "producer_org_documents" DROP CONSTRAINT "producer_org_documents_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "producer_org_staff" DROP CONSTRAINT "producer_org_staff_invitedBy_fkey";

-- DropForeignKey
ALTER TABLE "producer_org_staff" DROP CONSTRAINT "producer_org_staff_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "producer_org_staff" DROP CONSTRAINT "producer_org_staff_roleId_fkey";

-- DropForeignKey
ALTER TABLE "producer_org_staff" DROP CONSTRAINT "producer_org_staff_userId_fkey";

-- DropForeignKey
ALTER TABLE "producer_orgs" DROP CONSTRAINT "producer_orgs_ownerUserId_fkey";

-- DropForeignKey
ALTER TABLE "producer_staff_invite_deliveries" DROP CONSTRAINT "producer_staff_invite_deliveries_inviteId_fkey";

-- DropForeignKey
ALTER TABLE "producer_staff_invites" DROP CONSTRAINT "producer_staff_invites_acceptedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "producer_staff_invites" DROP CONSTRAINT "producer_staff_invites_invitedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "producer_staff_invites" DROP CONSTRAINT "producer_staff_invites_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "producer_staff_invites" DROP CONSTRAINT "producer_staff_invites_roleId_fkey";

-- DropForeignKey
ALTER TABLE "product_change_requests" DROP CONSTRAINT "product_change_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "product_change_requests" DROP CONSTRAINT "product_change_requests_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "product_change_requests" DROP CONSTRAINT "product_change_requests_requestedFromBranchId_fkey";

-- DropForeignKey
ALTER TABLE "product_change_requests" DROP CONSTRAINT "product_change_requests_reviewedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "product_fingerprints" DROP CONSTRAINT "product_fingerprints_productVersionId_fkey";

-- DropForeignKey
ALTER TABLE "product_import_batches" DROP CONSTRAINT "product_import_batches_branchId_fkey";

-- DropForeignKey
ALTER TABLE "product_import_batches" DROP CONSTRAINT "product_import_batches_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "product_import_batches" DROP CONSTRAINT "product_import_batches_orgId_fkey";

-- DropForeignKey
ALTER TABLE "product_import_rows" DROP CONSTRAINT "product_import_rows_batchId_fkey";

-- DropForeignKey
ALTER TABLE "product_import_rows" DROP CONSTRAINT "product_import_rows_matchedProductId_fkey";

-- DropForeignKey
ALTER TABLE "product_media" DROP CONSTRAINT "product_media_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "product_media" DROP CONSTRAINT "product_media_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_pricings" DROP CONSTRAINT "product_pricings_orgId_fkey";

-- DropForeignKey
ALTER TABLE "product_pricings" DROP CONSTRAINT "product_pricings_variantId_fkey";

-- DropForeignKey
ALTER TABLE "product_revisions" DROP CONSTRAINT "product_revisions_authProductId_fkey";

-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_flavorId_fkey";

-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_unitId_fkey";

-- DropForeignKey
ALTER TABLE "product_versions" DROP CONSTRAINT "product_versions_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "product_versions" DROP CONSTRAINT "product_versions_productId_fkey";

-- DropForeignKey
ALTER TABLE "production_lines" DROP CONSTRAINT "production_lines_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_brandId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_masterCatalogId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_medicineListingId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_orgId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_preferredVendorId_fkey";

-- DropForeignKey
ALTER TABLE "proof_of_deliveries" DROP CONSTRAINT "proof_of_deliveries_deliveryAssignmentId_fkey";

-- DropForeignKey
ALTER TABLE "proof_of_deliveries" DROP CONSTRAINT "proof_of_deliveries_dispatchId_fkey";

-- DropForeignKey
ALTER TABLE "proof_of_deliveries" DROP CONSTRAINT "proof_of_deliveries_orgId_fkey";

-- DropForeignKey
ALTER TABLE "proof_of_deliveries" DROP CONSTRAINT "proof_of_deliveries_recordedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_order_lines" DROP CONSTRAINT "purchase_order_lines_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_order_lines" DROP CONSTRAINT "purchase_order_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_orgId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_purchaseRequisitionId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_rejectedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_requisition_lines" DROP CONSTRAINT "purchase_requisition_lines_purchaseRequisitionId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_requisition_lines" DROP CONSTRAINT "purchase_requisition_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_requisitions" DROP CONSTRAINT "purchase_requisitions_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_requisitions" DROP CONSTRAINT "purchase_requisitions_orgId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_requisitions" DROP CONSTRAINT "purchase_requisitions_rejectedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_requisitions" DROP CONSTRAINT "purchase_requisitions_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_requisitions" DROP CONSTRAINT "purchase_requisitions_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_requisitions" DROP CONSTRAINT "purchase_requisitions_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "putaway_tasks" DROP CONSTRAINT "putaway_tasks_completedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "putaway_tasks" DROP CONSTRAINT "putaway_tasks_fromLocationId_fkey";

-- DropForeignKey
ALTER TABLE "putaway_tasks" DROP CONSTRAINT "putaway_tasks_grnId_fkey";

-- DropForeignKey
ALTER TABLE "putaway_tasks" DROP CONSTRAINT "putaway_tasks_grnLineId_fkey";

-- DropForeignKey
ALTER TABLE "putaway_tasks" DROP CONSTRAINT "putaway_tasks_lotId_fkey";

-- DropForeignKey
ALTER TABLE "putaway_tasks" DROP CONSTRAINT "putaway_tasks_orgId_fkey";

-- DropForeignKey
ALTER TABLE "putaway_tasks" DROP CONSTRAINT "putaway_tasks_stockTransferId_fkey";

-- DropForeignKey
ALTER TABLE "putaway_tasks" DROP CONSTRAINT "putaway_tasks_toLocationId_fkey";

-- DropForeignKey
ALTER TABLE "putaway_tasks" DROP CONSTRAINT "putaway_tasks_variantId_fkey";

-- DropForeignKey
ALTER TABLE "putaway_tasks" DROP CONSTRAINT "putaway_tasks_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "qc_inspections" DROP CONSTRAINT "qc_inspections_grnId_fkey";

-- DropForeignKey
ALTER TABLE "qc_inspections" DROP CONSTRAINT "qc_inspections_grnLineId_fkey";

-- DropForeignKey
ALTER TABLE "qc_inspections" DROP CONSTRAINT "qc_inspections_inspectedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "qc_inspections" DROP CONSTRAINT "qc_inspections_locationId_fkey";

-- DropForeignKey
ALTER TABLE "qc_inspections" DROP CONSTRAINT "qc_inspections_lotId_fkey";

-- DropForeignKey
ALTER TABLE "qc_inspections" DROP CONSTRAINT "qc_inspections_orgId_fkey";

-- DropForeignKey
ALTER TABLE "qc_inspections" DROP CONSTRAINT "qc_inspections_quarantineLocationId_fkey";

-- DropForeignKey
ALTER TABLE "qc_inspections" DROP CONSTRAINT "qc_inspections_variantId_fkey";

-- DropForeignKey
ALTER TABLE "qc_inspections" DROP CONSTRAINT "qc_inspections_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "queue_events" DROP CONSTRAINT "queue_events_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "queue_sessions" DROP CONSTRAINT "queue_sessions_branchId_fkey";

-- DropForeignKey
ALTER TABLE "queue_sessions" DROP CONSTRAINT "queue_sessions_orgId_fkey";

-- DropForeignKey
ALTER TABLE "queue_tickets" DROP CONSTRAINT "queue_tickets_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "queue_tickets" DROP CONSTRAINT "queue_tickets_branchId_fkey";

-- DropForeignKey
ALTER TABLE "queue_tickets" DROP CONSTRAINT "queue_tickets_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "queue_tickets" DROP CONSTRAINT "queue_tickets_orgId_fkey";

-- DropForeignKey
ALTER TABLE "queue_tickets" DROP CONSTRAINT "queue_tickets_queueSessionId_fkey";

-- DropForeignKey
ALTER TABLE "queue_tickets" DROP CONSTRAINT "queue_tickets_visitId_fkey";

-- DropForeignKey
ALTER TABLE "quota_plans" DROP CONSTRAINT "quota_plans_contractId_fkey";

-- DropForeignKey
ALTER TABLE "quota_plans" DROP CONSTRAINT "quota_plans_productId_fkey";

-- DropForeignKey
ALTER TABLE "quota_usages" DROP CONSTRAINT "quota_usages_batchId_fkey";

-- DropForeignKey
ALTER TABLE "recall_campaigns" DROP CONSTRAINT "recall_campaigns_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "recall_campaigns" DROP CONSTRAINT "recall_campaigns_orgId_fkey";

-- DropForeignKey
ALTER TABLE "replenishment_recommendations" DROP CONSTRAINT "replenishment_recommendations_branchId_fkey";

-- DropForeignKey
ALTER TABLE "replenishment_recommendations" DROP CONSTRAINT "replenishment_recommendations_clinicalItemId_fkey";

-- DropForeignKey
ALTER TABLE "replenishment_recommendations" DROP CONSTRAINT "replenishment_recommendations_orgId_fkey";

-- DropForeignKey
ALTER TABLE "replenishment_recommendations" DROP CONSTRAINT "replenishment_recommendations_variantId_fkey";

-- DropForeignKey
ALTER TABLE "retail_discount_approval_requests" DROP CONSTRAINT "retail_discount_approval_requests_branchId_fkey";

-- DropForeignKey
ALTER TABLE "retail_discount_approval_requests" DROP CONSTRAINT "retail_discount_approval_requests_consumedOrderId_fkey";

-- DropForeignKey
ALTER TABLE "retail_discount_approval_requests" DROP CONSTRAINT "retail_discount_approval_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "retail_discount_approval_requests" DROP CONSTRAINT "retail_discount_approval_requests_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "retail_discount_approval_requests" DROP CONSTRAINT "retail_discount_approval_requests_reviewedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "retail_discount_approval_requests" DROP CONSTRAINT "retail_discount_approval_requests_variantId_fkey";

-- DropForeignKey
ALTER TABLE "retail_discount_rules" DROP CONSTRAINT "retail_discount_rules_branchId_fkey";

-- DropForeignKey
ALTER TABLE "retail_discount_rules" DROP CONSTRAINT "retail_discount_rules_orgId_fkey";

-- DropForeignKey
ALTER TABLE "retail_discount_rules" DROP CONSTRAINT "retail_discount_rules_updatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "retail_discount_rules" DROP CONSTRAINT "retail_discount_rules_variantId_fkey";

-- DropForeignKey
ALTER TABLE "return_items" DROP CONSTRAINT "return_items_locationId_fkey";

-- DropForeignKey
ALTER TABLE "return_items" DROP CONSTRAINT "return_items_returnRequestId_fkey";

-- DropForeignKey
ALTER TABLE "return_items" DROP CONSTRAINT "return_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "return_requests" DROP CONSTRAINT "return_requests_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "return_requests" DROP CONSTRAINT "return_requests_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "reverse_logistics_cases" DROP CONSTRAINT "reverse_logistics_cases_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "reverse_logistics_cases" DROP CONSTRAINT "reverse_logistics_cases_orgId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "room_schedule_templates" DROP CONSTRAINT "room_schedule_templates_branchId_fkey";

-- DropForeignKey
ALTER TABLE "room_schedule_templates" DROP CONSTRAINT "room_schedule_templates_branchRoomId_fkey";

-- DropForeignKey
ALTER TABLE "room_schedule_templates" DROP CONSTRAINT "room_schedule_templates_orgId_fkey";

-- DropForeignKey
ALTER TABLE "scan_events" DROP CONSTRAINT "scan_events_serialId_fkey";

-- DropForeignKey
ALTER TABLE "scenario_result_snapshots" DROP CONSTRAINT "scenario_result_snapshots_scenarioRunId_fkey";

-- DropForeignKey
ALTER TABLE "scenario_runs" DROP CONSTRAINT "scenario_runs_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "scenario_runs" DROP CONSTRAINT "scenario_runs_orgId_fkey";

-- DropForeignKey
ALTER TABLE "serial_ranges" DROP CONSTRAINT "serial_ranges_batchId_fkey";

-- DropForeignKey
ALTER TABLE "serial_ranges" DROP CONSTRAINT "serial_ranges_issuedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "serials" DROP CONSTRAINT "serials_batchId_fkey";

-- DropForeignKey
ALTER TABLE "service_deliveries" DROP CONSTRAINT "service_deliveries_orderId_fkey";

-- DropForeignKey
ALTER TABLE "service_deliveries" DROP CONSTRAINT "service_deliveries_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "service_deliveries" DROP CONSTRAINT "service_deliveries_visitId_fkey";

-- DropForeignKey
ALTER TABLE "service_level_objectives" DROP CONSTRAINT "service_level_objectives_orgId_fkey";

-- DropForeignKey
ALTER TABLE "service_media" DROP CONSTRAINT "service_media_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "service_media" DROP CONSTRAINT "service_media_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "service_pricing_change_logs" DROP CONSTRAINT "service_pricing_change_logs_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "service_pricing_variants" DROP CONSTRAINT "service_pricing_variants_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "service_proposals" DROP CONSTRAINT "service_proposals_branchId_fkey";

-- DropForeignKey
ALTER TABLE "service_proposals" DROP CONSTRAINT "service_proposals_orgId_fkey";

-- DropForeignKey
ALTER TABLE "settlement_adjustments" DROP CONSTRAINT "settlement_adjustments_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "settlement_adjustments" DROP CONSTRAINT "settlement_adjustments_ledgerId_fkey";

-- DropForeignKey
ALTER TABLE "settlement_adjustments" DROP CONSTRAINT "settlement_adjustments_settlementBatchId_fkey";

-- DropForeignKey
ALTER TABLE "settlement_audit_logs" DROP CONSTRAINT "settlement_audit_logs_branchId_fkey";

-- DropForeignKey
ALTER TABLE "settlement_audit_logs" DROP CONSTRAINT "settlement_audit_logs_orgId_fkey";

-- DropForeignKey
ALTER TABLE "settlement_payments" DROP CONSTRAINT "settlement_payments_paidByUserId_fkey";

-- DropForeignKey
ALTER TABLE "settlement_payments" DROP CONSTRAINT "settlement_payments_settlementBatchId_fkey";

-- DropForeignKey
ALTER TABLE "slo_measurements" DROP CONSTRAINT "slo_measurements_orgId_fkey";

-- DropForeignKey
ALTER TABLE "slo_measurements" DROP CONSTRAINT "slo_measurements_sloId_fkey";

-- DropForeignKey
ALTER TABLE "slot_locks" DROP CONSTRAINT "slot_locks_branchId_fkey";

-- DropForeignKey
ALTER TABLE "slot_locks" DROP CONSTRAINT "slot_locks_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "slot_locks" DROP CONSTRAINT "slot_locks_orgId_fkey";

-- DropForeignKey
ALTER TABLE "staff_invites" DROP CONSTRAINT "staff_invites_acceptedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "staff_invites" DROP CONSTRAINT "staff_invites_branchId_fkey";

-- DropForeignKey
ALTER TABLE "staff_invites" DROP CONSTRAINT "staff_invites_invitedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "staff_invites" DROP CONSTRAINT "staff_invites_orgId_fkey";

-- DropForeignKey
ALTER TABLE "staff_invites" DROP CONSTRAINT "staff_invites_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "sterilization_cycle_items" DROP CONSTRAINT "sterilization_cycle_items_cycleId_fkey";

-- DropForeignKey
ALTER TABLE "sterilization_cycle_items" DROP CONSTRAINT "sterilization_cycle_items_instrumentId_fkey";

-- DropForeignKey
ALTER TABLE "sterilization_cycles" DROP CONSTRAINT "sterilization_cycles_branchId_fkey";

-- DropForeignKey
ALTER TABLE "sterilization_cycles" DROP CONSTRAINT "sterilization_cycles_operatorId_fkey";

-- DropForeignKey
ALTER TABLE "sterilization_cycles" DROP CONSTRAINT "sterilization_cycles_orgId_fkey";

-- DropForeignKey
ALTER TABLE "stock_adjustment_requests" DROP CONSTRAINT "stock_adjustment_requests_locationId_fkey";

-- DropForeignKey
ALTER TABLE "stock_adjustment_requests" DROP CONSTRAINT "stock_adjustment_requests_lotId_fkey";

-- DropForeignKey
ALTER TABLE "stock_adjustment_requests" DROP CONSTRAINT "stock_adjustment_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "stock_adjustment_requests" DROP CONSTRAINT "stock_adjustment_requests_requestedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_adjustment_requests" DROP CONSTRAINT "stock_adjustment_requests_reviewedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_adjustment_requests" DROP CONSTRAINT "stock_adjustment_requests_variantId_fkey";

-- DropForeignKey
ALTER TABLE "stock_balances" DROP CONSTRAINT "stock_balances_locationId_fkey";

-- DropForeignKey
ALTER TABLE "stock_balances" DROP CONSTRAINT "stock_balances_variantId_fkey";

-- DropForeignKey
ALTER TABLE "stock_count_lines" DROP CONSTRAINT "stock_count_lines_lotId_fkey";

-- DropForeignKey
ALTER TABLE "stock_count_lines" DROP CONSTRAINT "stock_count_lines_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "stock_count_lines" DROP CONSTRAINT "stock_count_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "stock_count_sessions" DROP CONSTRAINT "stock_count_sessions_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_count_sessions" DROP CONSTRAINT "stock_count_sessions_locationId_fkey";

-- DropForeignKey
ALTER TABLE "stock_count_sessions" DROP CONSTRAINT "stock_count_sessions_orgId_fkey";

-- DropForeignKey
ALTER TABLE "stock_discrepancies" DROP CONSTRAINT "stock_discrepancies_lotId_fkey";

-- DropForeignKey
ALTER TABLE "stock_discrepancies" DROP CONSTRAINT "stock_discrepancies_resolvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_discrepancies" DROP CONSTRAINT "stock_discrepancies_transferId_fkey";

-- DropForeignKey
ALTER TABLE "stock_discrepancies" DROP CONSTRAINT "stock_discrepancies_variantId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatch_discrepancies" DROP CONSTRAINT "stock_dispatch_discrepancies_lotId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatch_discrepancies" DROP CONSTRAINT "stock_dispatch_discrepancies_orgId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatch_discrepancies" DROP CONSTRAINT "stock_dispatch_discrepancies_resolvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatch_discrepancies" DROP CONSTRAINT "stock_dispatch_discrepancies_stockDispatchId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatch_discrepancies" DROP CONSTRAINT "stock_dispatch_discrepancies_variantId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatch_items" DROP CONSTRAINT "stock_dispatch_items_lotId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatch_items" DROP CONSTRAINT "stock_dispatch_items_stockDispatchId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatch_items" DROP CONSTRAINT "stock_dispatch_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatches" DROP CONSTRAINT "stock_dispatches_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatches" DROP CONSTRAINT "stock_dispatches_fromLocationId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatches" DROP CONSTRAINT "stock_dispatches_orgId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatches" DROP CONSTRAINT "stock_dispatches_stockRequestId_fkey";

-- DropForeignKey
ALTER TABLE "stock_dispatches" DROP CONSTRAINT "stock_dispatches_toLocationId_fkey";

-- DropForeignKey
ALTER TABLE "stock_ledgers" DROP CONSTRAINT "stock_ledgers_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_ledgers" DROP CONSTRAINT "stock_ledgers_locationId_fkey";

-- DropForeignKey
ALTER TABLE "stock_ledgers" DROP CONSTRAINT "stock_ledgers_lotId_fkey";

-- DropForeignKey
ALTER TABLE "stock_ledgers" DROP CONSTRAINT "stock_ledgers_orgId_fkey";

-- DropForeignKey
ALTER TABLE "stock_ledgers" DROP CONSTRAINT "stock_ledgers_variantId_fkey";

-- DropForeignKey
ALTER TABLE "stock_lot_balances" DROP CONSTRAINT "stock_lot_balances_locationId_fkey";

-- DropForeignKey
ALTER TABLE "stock_lot_balances" DROP CONSTRAINT "stock_lot_balances_lotId_fkey";

-- DropForeignKey
ALTER TABLE "stock_lots" DROP CONSTRAINT "stock_lots_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_lots" DROP CONSTRAINT "stock_lots_orgId_fkey";

-- DropForeignKey
ALTER TABLE "stock_lots" DROP CONSTRAINT "stock_lots_variantId_fkey";

-- DropForeignKey
ALTER TABLE "stock_request_items" DROP CONSTRAINT "stock_request_items_cancelledByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_request_items" DROP CONSTRAINT "stock_request_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "stock_request_items" DROP CONSTRAINT "stock_request_items_stockRequestId_fkey";

-- DropForeignKey
ALTER TABLE "stock_request_items" DROP CONSTRAINT "stock_request_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "stock_requests" DROP CONSTRAINT "stock_requests_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_requests" DROP CONSTRAINT "stock_requests_branchId_fkey";

-- DropForeignKey
ALTER TABLE "stock_requests" DROP CONSTRAINT "stock_requests_declinedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_requests" DROP CONSTRAINT "stock_requests_linkedPurchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "stock_requests" DROP CONSTRAINT "stock_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "stock_requests" DROP CONSTRAINT "stock_requests_preferredVendorId_fkey";

-- DropForeignKey
ALTER TABLE "stock_requests" DROP CONSTRAINT "stock_requests_requesterUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_return_items" DROP CONSTRAINT "stock_return_items_lotId_fkey";

-- DropForeignKey
ALTER TABLE "stock_return_items" DROP CONSTRAINT "stock_return_items_stockReturnId_fkey";

-- DropForeignKey
ALTER TABLE "stock_return_items" DROP CONSTRAINT "stock_return_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "stock_returns" DROP CONSTRAINT "stock_returns_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_returns" DROP CONSTRAINT "stock_returns_fromLocationId_fkey";

-- DropForeignKey
ALTER TABLE "stock_returns" DROP CONSTRAINT "stock_returns_linkedVendorReturnId_fkey";

-- DropForeignKey
ALTER TABLE "stock_returns" DROP CONSTRAINT "stock_returns_orgId_fkey";

-- DropForeignKey
ALTER TABLE "stock_returns" DROP CONSTRAINT "stock_returns_receivedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_returns" DROP CONSTRAINT "stock_returns_toLocationId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transactions" DROP CONSTRAINT "stock_transactions_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transactions" DROP CONSTRAINT "stock_transactions_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transfer_items" DROP CONSTRAINT "stock_transfer_items_lotId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transfer_items" DROP CONSTRAINT "stock_transfer_items_stockRequestItemId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transfer_items" DROP CONSTRAINT "stock_transfer_items_transferId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transfer_items" DROP CONSTRAINT "stock_transfer_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transfers" DROP CONSTRAINT "stock_transfers_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transfers" DROP CONSTRAINT "stock_transfers_fromLocationId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transfers" DROP CONSTRAINT "stock_transfers_stockRequestId_fkey";

-- DropForeignKey
ALTER TABLE "stock_transfers" DROP CONSTRAINT "stock_transfers_toLocationId_fkey";

-- DropForeignKey
ALTER TABLE "support_tickets" DROP CONSTRAINT "support_tickets_assignedToUserId_fkey";

-- DropForeignKey
ALTER TABLE "support_tickets" DROP CONSTRAINT "support_tickets_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "support_tickets" DROP CONSTRAINT "support_tickets_escalatedCaseId_fkey";

-- DropForeignKey
ALTER TABLE "support_tickets" DROP CONSTRAINT "support_tickets_producerOrgId_fkey";

-- DropForeignKey
ALTER TABLE "surgery_case_checklists" DROP CONSTRAINT "surgery_case_checklists_completedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "surgery_case_checklists" DROP CONSTRAINT "surgery_case_checklists_surgeryCaseId_fkey";

-- DropForeignKey
ALTER TABLE "surgery_case_staff" DROP CONSTRAINT "surgery_case_staff_branchMemberId_fkey";

-- DropForeignKey
ALTER TABLE "surgery_case_staff" DROP CONSTRAINT "surgery_case_staff_surgeryCaseId_fkey";

-- DropForeignKey
ALTER TABLE "surgery_case_status_logs" DROP CONSTRAINT "surgery_case_status_logs_changedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "surgery_case_status_logs" DROP CONSTRAINT "surgery_case_status_logs_surgeryCaseId_fkey";

-- DropForeignKey
ALTER TABLE "surgery_package_consumptions" DROP CONSTRAINT "surgery_package_consumptions_templateId_fkey";

-- DropForeignKey
ALTER TABLE "surgery_package_consumptions" DROP CONSTRAINT "surgery_package_consumptions_variantId_fkey";

-- DropForeignKey
ALTER TABLE "surgery_package_consumptions" DROP CONSTRAINT "surgery_package_consumptions_visitId_fkey";

-- DropForeignKey
ALTER TABLE "surgery_package_templates" DROP CONSTRAINT "surgery_package_templates_orgId_fkey";

-- DropForeignKey
ALTER TABLE "surgery_package_templates" DROP CONSTRAINT "surgery_package_templates_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "team_invitations" DROP CONSTRAINT "team_invitations_acceptedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "team_invitations" DROP CONSTRAINT "team_invitations_invitedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "team_invitations" DROP CONSTRAINT "team_invitations_ownerUserId_fkey";

-- DropForeignKey
ALTER TABLE "team_invitations" DROP CONSTRAINT "team_invitations_teamId_fkey";

-- DropForeignKey
ALTER TABLE "template_category_items" DROP CONSTRAINT "template_category_items_masterCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "template_category_items" DROP CONSTRAINT "template_category_items_masterItemId_fkey";

-- DropForeignKey
ALTER TABLE "template_category_items" DROP CONSTRAINT "template_category_items_templateId_fkey";

-- DropForeignKey
ALTER TABLE "ticket_attachments" DROP CONSTRAINT "ticket_attachments_ticketMessageId_fkey";

-- DropForeignKey
ALTER TABLE "ticket_attachments" DROP CONSTRAINT "ticket_attachments_uploadedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "ticket_audit_events" DROP CONSTRAINT "ticket_audit_events_actorUserId_fkey";

-- DropForeignKey
ALTER TABLE "ticket_audit_events" DROP CONSTRAINT "ticket_audit_events_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "ticket_messages" DROP CONSTRAINT "ticket_messages_senderUserId_fkey";

-- DropForeignKey
ALTER TABLE "ticket_messages" DROP CONSTRAINT "ticket_messages_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_course_doses" DROP CONSTRAINT "treatment_course_doses_courseId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_course_doses" DROP CONSTRAINT "treatment_course_doses_vialSessionId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_courses" DROP CONSTRAINT "treatment_courses_branchId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_courses" DROP CONSTRAINT "treatment_courses_patientId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_courses" DROP CONSTRAINT "treatment_courses_prescribedByDoctorId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_courses" DROP CONSTRAINT "treatment_courses_treatmentBranchId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_courses" DROP CONSTRAINT "treatment_courses_variantId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_courses" DROP CONSTRAINT "treatment_courses_visitId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_day_items" DROP CONSTRAINT "treatment_day_items_treatmentDayId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_day_items" DROP CONSTRAINT "treatment_day_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_days" DROP CONSTRAINT "treatment_days_courseId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_revisions" DROP CONSTRAINT "treatment_revisions_changedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_revisions" DROP CONSTRAINT "treatment_revisions_courseId_fkey";

-- DropForeignKey
ALTER TABLE "user_contexts" DROP CONSTRAINT "user_contexts_branchId_fkey";

-- DropForeignKey
ALTER TABLE "user_contexts" DROP CONSTRAINT "user_contexts_ownerUserId_fkey";

-- DropForeignKey
ALTER TABLE "user_contexts" DROP CONSTRAINT "user_contexts_teamId_fkey";

-- DropForeignKey
ALTER TABLE "user_contexts" DROP CONSTRAINT "user_contexts_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_country_roles" DROP CONSTRAINT "user_country_roles_countryId_fkey";

-- DropForeignKey
ALTER TABLE "user_country_roles" DROP CONSTRAINT "user_country_roles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_country_roles" DROP CONSTRAINT "user_country_roles_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_global_roles" DROP CONSTRAINT "user_global_roles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_global_roles" DROP CONSTRAINT "user_global_roles_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_medicine_risk_scores" DROP CONSTRAINT "user_medicine_risk_scores_branchId_fkey";

-- DropForeignKey
ALTER TABLE "user_medicine_risk_scores" DROP CONSTRAINT "user_medicine_risk_scores_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_state_roles" DROP CONSTRAINT "user_state_roles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_state_roles" DROP CONSTRAINT "user_state_roles_stateId_fkey";

-- DropForeignKey
ALTER TABLE "user_state_roles" DROP CONSTRAINT "user_state_roles_userId_fkey";

-- DropForeignKey
ALTER TABLE "vaccine_inventory_mappings" DROP CONSTRAINT "vaccine_inventory_mappings_clinicalItemId_fkey";

-- DropForeignKey
ALTER TABLE "vaccine_inventory_mappings" DROP CONSTRAINT "vaccine_inventory_mappings_clinicalItemVariantId_fkey";

-- DropForeignKey
ALTER TABLE "vaccine_inventory_mappings" DROP CONSTRAINT "vaccine_inventory_mappings_orgId_fkey";

-- DropForeignKey
ALTER TABLE "vaccine_inventory_mappings" DROP CONSTRAINT "vaccine_inventory_mappings_vaccineTypeId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_attachments" DROP CONSTRAINT "vendor_attachments_orgId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_attachments" DROP CONSTRAINT "vendor_attachments_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_contacts" DROP CONSTRAINT "vendor_contacts_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_ledger_entries" DROP CONSTRAINT "vendor_ledger_entries_orgId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_ledger_entries" DROP CONSTRAINT "vendor_ledger_entries_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_product_listings" DROP CONSTRAINT "vendor_product_listings_commissionRuleId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_product_listings" DROP CONSTRAINT "vendor_product_listings_productId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_product_listings" DROP CONSTRAINT "vendor_product_listings_variantId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_product_listings" DROP CONSTRAINT "vendor_product_listings_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_receive_sessions" DROP CONSTRAINT "vendor_receive_sessions_confirmedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_receive_sessions" DROP CONSTRAINT "vendor_receive_sessions_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_receive_sessions" DROP CONSTRAINT "vendor_receive_sessions_grnId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_receive_sessions" DROP CONSTRAINT "vendor_receive_sessions_orgId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_receive_sessions" DROP CONSTRAINT "vendor_receive_sessions_submittedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_return_lines" DROP CONSTRAINT "vendor_return_lines_ledgerId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_return_lines" DROP CONSTRAINT "vendor_return_lines_lotId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_return_lines" DROP CONSTRAINT "vendor_return_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_return_lines" DROP CONSTRAINT "vendor_return_lines_vendorReturnId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_returns" DROP CONSTRAINT "vendor_returns_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_returns" DROP CONSTRAINT "vendor_returns_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_returns" DROP CONSTRAINT "vendor_returns_locationId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_returns" DROP CONSTRAINT "vendor_returns_orgId_fkey";

-- DropForeignKey
ALTER TABLE "vendor_returns" DROP CONSTRAINT "vendor_returns_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "vet_regulatory_bodies" DROP CONSTRAINT "vet_regulatory_bodies_countryId_fkey";

-- DropForeignKey
ALTER TABLE "vet_required_doc_types" DROP CONSTRAINT "vet_required_doc_types_regulatoryBodyId_fkey";

-- DropForeignKey
ALTER TABLE "vial_instances" DROP CONSTRAINT "vial_instances_branchId_fkey";

-- DropForeignKey
ALTER TABLE "vial_instances" DROP CONSTRAINT "vial_instances_locationId_fkey";

-- DropForeignKey
ALTER TABLE "vial_instances" DROP CONSTRAINT "vial_instances_lotId_fkey";

-- DropForeignKey
ALTER TABLE "vial_instances" DROP CONSTRAINT "vial_instances_orgId_fkey";

-- DropForeignKey
ALTER TABLE "vial_instances" DROP CONSTRAINT "vial_instances_variantId_fkey";

-- DropForeignKey
ALTER TABLE "vial_return_controls" DROP CONSTRAINT "vial_return_controls_branchId_fkey";

-- DropForeignKey
ALTER TABLE "vial_return_controls" DROP CONSTRAINT "vial_return_controls_clinicalCaseId_fkey";

-- DropForeignKey
ALTER TABLE "vial_return_controls" DROP CONSTRAINT "vial_return_controls_procedureOrderId_fkey";

-- DropForeignKey
ALTER TABLE "vial_return_controls" DROP CONSTRAINT "vial_return_controls_variantId_fkey";

-- DropForeignKey
ALTER TABLE "vial_return_controls" DROP CONSTRAINT "vial_return_controls_visitId_fkey";

-- DropForeignKey
ALTER TABLE "vial_returns" DROP CONSTRAINT "vial_returns_receivedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "vial_returns" DROP CONSTRAINT "vial_returns_returnedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "vial_returns" DROP CONSTRAINT "vial_returns_vialSessionId_fkey";

-- DropForeignKey
ALTER TABLE "vial_session_events" DROP CONSTRAINT "vial_session_events_performedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "vial_session_events" DROP CONSTRAINT "vial_session_events_vialSessionId_fkey";

-- DropForeignKey
ALTER TABLE "vial_sessions" DROP CONSTRAINT "vial_sessions_activatedFromDispenseRequestId_fkey";

-- DropForeignKey
ALTER TABLE "vial_sessions" DROP CONSTRAINT "vial_sessions_branchId_fkey";

-- DropForeignKey
ALTER TABLE "vial_sessions" DROP CONSTRAINT "vial_sessions_lotId_fkey";

-- DropForeignKey
ALTER TABLE "vial_sessions" DROP CONSTRAINT "vial_sessions_openedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "vial_sessions" DROP CONSTRAINT "vial_sessions_roomId_fkey";

-- DropForeignKey
ALTER TABLE "vial_sessions" DROP CONSTRAINT "vial_sessions_variantId_fkey";

-- DropForeignKey
ALTER TABLE "vial_sessions" DROP CONSTRAINT "vial_sessions_vialInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "visit_attachments" DROP CONSTRAINT "visit_attachments_visitId_fkey";

-- DropForeignKey
ALTER TABLE "vital_records" DROP CONSTRAINT "vital_records_visitId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_audit_events" DROP CONSTRAINT "warehouse_audit_events_actorUserId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_audit_events" DROP CONSTRAINT "warehouse_audit_events_orgId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_staff_assignments" DROP CONSTRAINT "warehouse_staff_assignments_userId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_staff_assignments" DROP CONSTRAINT "warehouse_staff_assignments_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_transfer_order_lines" DROP CONSTRAINT "warehouse_transfer_order_lines_inboundLedgerId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_transfer_order_lines" DROP CONSTRAINT "warehouse_transfer_order_lines_lotId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_transfer_order_lines" DROP CONSTRAINT "warehouse_transfer_order_lines_outboundLedgerId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_transfer_order_lines" DROP CONSTRAINT "warehouse_transfer_order_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_transfer_order_lines" DROP CONSTRAINT "warehouse_transfer_order_lines_warehouseTransferOrderId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_transfer_orders" DROP CONSTRAINT "warehouse_transfer_orders_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_transfer_orders" DROP CONSTRAINT "warehouse_transfer_orders_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_transfer_orders" DROP CONSTRAINT "warehouse_transfer_orders_fromLocationId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_transfer_orders" DROP CONSTRAINT "warehouse_transfer_orders_orgId_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_transfer_orders" DROP CONSTRAINT "warehouse_transfer_orders_toLocationId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_alerts" DROP CONSTRAINT "workspace_alerts_acknowledgedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_alerts" DROP CONSTRAINT "workspace_alerts_branchId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_alerts" DROP CONSTRAINT "workspace_alerts_orgId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_approval_requests" DROP CONSTRAINT "workspace_approval_requests_branchId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_approval_requests" DROP CONSTRAINT "workspace_approval_requests_decidedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_approval_requests" DROP CONSTRAINT "workspace_approval_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_approval_requests" DROP CONSTRAINT "workspace_approval_requests_requesterUserId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_task_comments" DROP CONSTRAINT "workspace_task_comments_actorId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_task_comments" DROP CONSTRAINT "workspace_task_comments_taskId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_tasks" DROP CONSTRAINT "workspace_tasks_assignedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_tasks" DROP CONSTRAINT "workspace_tasks_assignedToUserId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_tasks" DROP CONSTRAINT "workspace_tasks_branchId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_tasks" DROP CONSTRAINT "workspace_tasks_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_tasks" DROP CONSTRAINT "workspace_tasks_lastUpdatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_tasks" DROP CONSTRAINT "workspace_tasks_orgId_fkey";

-- DropForeignKey
ALTER TABLE "write_off_request_lines" DROP CONSTRAINT "write_off_request_lines_ledgerId_fkey";

-- DropForeignKey
ALTER TABLE "write_off_request_lines" DROP CONSTRAINT "write_off_request_lines_lotId_fkey";

-- DropForeignKey
ALTER TABLE "write_off_request_lines" DROP CONSTRAINT "write_off_request_lines_variantId_fkey";

-- DropForeignKey
ALTER TABLE "write_off_request_lines" DROP CONSTRAINT "write_off_request_lines_writeOffRequestId_fkey";

-- DropForeignKey
ALTER TABLE "write_off_requests" DROP CONSTRAINT "write_off_requests_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "write_off_requests" DROP CONSTRAINT "write_off_requests_locationId_fkey";

-- DropForeignKey
ALTER TABLE "write_off_requests" DROP CONSTRAINT "write_off_requests_orgId_fkey";

-- DropForeignKey
ALTER TABLE "write_off_requests" DROP CONSTRAINT "write_off_requests_requestedByUserId_fkey";

-- AlterTable
ALTER TABLE "bd_unions" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "campaign_bookings" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "campaign_included_vaccines" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "campaign_locations" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "campaign_pets" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "campaign_slots" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "campaigns" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "coverage_zone_areas" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "coverage_zone_metadata" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "coverage_zones" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "location_coverage_assignments" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "BranchTypeOnBranch";

-- DropTable
DROP TABLE "access_invites";

-- DropTable
DROP TABLE "ai_forecast_snapshots";

-- DropTable
DROP TABLE "ai_job_runs";

-- DropTable
DROP TABLE "ai_procurement_recommendations";

-- DropTable
DROP TABLE "ai_recommendation_overrides";

-- DropTable
DROP TABLE "ai_replenishment_suggestions";

-- DropTable
DROP TABLE "allocation_plan_events";

-- DropTable
DROP TABLE "allocation_plan_lines";

-- DropTable
DROP TABLE "allocation_plans";

-- DropTable
DROP TABLE "allocation_source_summaries";

-- DropTable
DROP TABLE "applied_discounts";

-- DropTable
DROP TABLE "appointment_events";

-- DropTable
DROP TABLE "approval_action_logs";

-- DropTable
DROP TABLE "audit_bin_items";

-- DropTable
DROP TABLE "audit_bins";

-- DropTable
DROP TABLE "audit_events";

-- DropTable
DROP TABLE "auth_batches";

-- DropTable
DROP TABLE "auth_codes";

-- DropTable
DROP TABLE "auth_product_proofs";

-- DropTable
DROP TABLE "auth_products";

-- DropTable
DROP TABLE "auth_verification_logs";

-- DropTable
DROP TABLE "backorders";

-- DropTable
DROP TABLE "batch_pricing_rules";

-- DropTable
DROP TABLE "batch_recalls";

-- DropTable
DROP TABLE "batch_serial_allocation_logs";

-- DropTable
DROP TABLE "batch_serial_states";

-- DropTable
DROP TABLE "batches";

-- DropTable
DROP TABLE "branch_access_permissions";

-- DropTable
DROP TABLE "branch_compliance_scores";

-- DropTable
DROP TABLE "branch_documents";

-- DropTable
DROP TABLE "branch_holidays";

-- DropTable
DROP TABLE "branch_item_batches";

-- DropTable
DROP TABLE "branch_item_stocks";

-- DropTable
DROP TABLE "branch_member_roles";

-- DropTable
DROP TABLE "branch_overhead_rules";

-- DropTable
DROP TABLE "branch_override_requests";

-- DropTable
DROP TABLE "branch_pricings";

-- DropTable
DROP TABLE "branch_publish_requests";

-- DropTable
DROP TABLE "branch_to_types";

-- DropTable
DROP TABLE "branch_types";

-- DropTable
DROP TABLE "brands";

-- DropTable
DROP TABLE "case_cost_sheets";

-- DropTable
DROP TABLE "case_evidence";

-- DropTable
DROP TABLE "catalog_enable_requests";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "clinic_approval_requests";

-- DropTable
DROP TABLE "clinic_catalog_install_batches";

-- DropTable
DROP TABLE "clinic_room_blocks";

-- DropTable
DROP TABLE "clinical_item_approval_logs";

-- DropTable
DROP TABLE "clinical_item_audit_logs";

-- DropTable
DROP TABLE "clinical_item_branch_configs";

-- DropTable
DROP TABLE "clinical_item_categories";

-- DropTable
DROP TABLE "clinical_item_media";

-- DropTable
DROP TABLE "clinical_item_variants";

-- DropTable
DROP TABLE "clinical_items";

-- DropTable
DROP TABLE "clinical_notes";

-- DropTable
DROP TABLE "clinical_stock_audit_lines";

-- DropTable
DROP TABLE "clinical_stock_audits";

-- DropTable
DROP TABLE "clinical_stock_ledger";

-- DropTable
DROP TABLE "clinical_stock_transfer_items";

-- DropTable
DROP TABLE "clinical_stock_transfers";

-- DropTable
DROP TABLE "clinical_supply_request_items";

-- DropTable
DROP TABLE "clinical_supply_request_status_history";

-- DropTable
DROP TABLE "clinical_supply_requests";

-- DropTable
DROP TABLE "clinical_wastage_logs";

-- DropTable
DROP TABLE "commission_rules";

-- DropTable
DROP TABLE "companies";

-- DropTable
DROP TABLE "complaint_cases";

-- DropTable
DROP TABLE "consultation_templates";

-- DropTable
DROP TABLE "consumable_item_profiles";

-- DropTable
DROP TABLE "consumption_items";

-- DropTable
DROP TABLE "contracts";

-- DropTable
DROP TABLE "cost_allocation_policies";

-- DropTable
DROP TABLE "cost_driver_inputs";

-- DropTable
DROP TABLE "cost_facts";

-- DropTable
DROP TABLE "country_medicine_brands";

-- DropTable
DROP TABLE "cts_summaries";

-- DropTable
DROP TABLE "daily_medicine_variances";

-- DropTable
DROP TABLE "daily_reconciliations";

-- DropTable
DROP TABLE "decision_approval_events";

-- DropTable
DROP TABLE "decision_package_items";

-- DropTable
DROP TABLE "decision_packages";

-- DropTable
DROP TABLE "delivery_assignments";

-- DropTable
DROP TABLE "destruction_records";

-- DropTable
DROP TABLE "discount_approval_rules";

-- DropTable
DROP TABLE "discount_audit_logs";

-- DropTable
DROP TABLE "discount_policies";

-- DropTable
DROP TABLE "dispatch_receive_session_lines";

-- DropTable
DROP TABLE "dispatch_receive_sessions";

-- DropTable
DROP TABLE "dispense_request_items";

-- DropTable
DROP TABLE "dispense_requests";

-- DropTable
DROP TABLE "doctor_audit_logs";

-- DropTable
DROP TABLE "doctor_contract_rules";

-- DropTable
DROP TABLE "doctor_contracts";

-- DropTable
DROP TABLE "doctor_credentials";

-- DropTable
DROP TABLE "doctor_leave_requests";

-- DropTable
DROP TABLE "doctor_licenses";

-- DropTable
DROP TABLE "doctor_package_mappings";

-- DropTable
DROP TABLE "doctor_requests";

-- DropTable
DROP TABLE "doctor_schedule_exceptions";

-- DropTable
DROP TABLE "doctor_schedule_proposals";

-- DropTable
DROP TABLE "doctor_schedule_templates";

-- DropTable
DROP TABLE "doctor_service_assignment_templates";

-- DropTable
DROP TABLE "doctor_service_fee_change_logs";

-- DropTable
DROP TABLE "doctor_service_fees";

-- DropTable
DROP TABLE "doctor_service_mappings";

-- DropTable
DROP TABLE "doctor_settlement_batches";

-- DropTable
DROP TABLE "doctor_settlement_ledger";

-- DropTable
DROP TABLE "doctor_verification_documents";

-- DropTable
DROP TABLE "enforcement_actions";

-- DropTable
DROP TABLE "enterprise_discount_rules";

-- DropTable
DROP TABLE "exception_severity_rules";

-- DropTable
DROP TABLE "expiry_write_off_logs";

-- DropTable
DROP TABLE "factories";

-- DropTable
DROP TABLE "flavors";

-- DropTable
DROP TABLE "governance_incidents";

-- DropTable
DROP TABLE "grn_lines";

-- DropTable
DROP TABLE "grns";

-- DropTable
DROP TABLE "inbound_discrepancies";

-- DropTable
DROP TABLE "inbound_shipment_lines";

-- DropTable
DROP TABLE "inbound_shipments";

-- DropTable
DROP TABLE "injection_token_medication_lines";

-- DropTable
DROP TABLE "injection_tokens";

-- DropTable
DROP TABLE "instrument_instances";

-- DropTable
DROP TABLE "instrument_issue_logs";

-- DropTable
DROP TABLE "instrument_item_profiles";

-- DropTable
DROP TABLE "integration_mappings";

-- DropTable
DROP TABLE "inventory";

-- DropTable
DROP TABLE "inventory_consumptions";

-- DropTable
DROP TABLE "inventory_variance_logs";

-- DropTable
DROP TABLE "invoice_cost_sheets";

-- DropTable
DROP TABLE "lab_report_items";

-- DropTable
DROP TABLE "lab_reports";

-- DropTable
DROP TABLE "lab_requisitions";

-- DropTable
DROP TABLE "location_prices";

-- DropTable
DROP TABLE "location_variant_configs";

-- DropTable
DROP TABLE "manager_approval_escalations";

-- DropTable
DROP TABLE "master_clinical_catalog_categories";

-- DropTable
DROP TABLE "master_clinical_catalog_items";

-- DropTable
DROP TABLE "master_clinical_catalog_templates";

-- DropTable
DROP TABLE "master_product_catalog";

-- DropTable
DROP TABLE "master_product_media";

-- DropTable
DROP TABLE "master_product_variants";

-- DropTable
DROP TABLE "medication_administrations";

-- DropTable
DROP TABLE "medicine_approval_actions";

-- DropTable
DROP TABLE "medicine_approval_requests";

-- DropTable
DROP TABLE "medicine_brands";

-- DropTable
DROP TABLE "medicine_control_day_closes";

-- DropTable
DROP TABLE "medicine_discrepancies";

-- DropTable
DROP TABLE "medicine_dosage_forms";

-- DropTable
DROP TABLE "medicine_generics";

-- DropTable
DROP TABLE "medicine_import_batches";

-- DropTable
DROP TABLE "medicine_import_entity_touches";

-- DropTable
DROP TABLE "medicine_import_rows";

-- DropTable
DROP TABLE "medicine_incidents";

-- DropTable
DROP TABLE "medicine_item_profiles";

-- DropTable
DROP TABLE "medicine_manufacturers";

-- DropTable
DROP TABLE "medicine_master_audit_logs";

-- DropTable
DROP TABLE "medicine_policies";

-- DropTable
DROP TABLE "medicine_presentations";

-- DropTable
DROP TABLE "medicine_requisition_items";

-- DropTable
DROP TABLE "medicine_requisition_timeline";

-- DropTable
DROP TABLE "medicine_requisitions";

-- DropTable
DROP TABLE "membership_tier_branch_scopes";

-- DropTable
DROP TABLE "membership_tier_exclusions";

-- DropTable
DROP TABLE "membership_tiers";

-- DropTable
DROP TABLE "network_balance_snapshots";

-- DropTable
DROP TABLE "network_transfer_recommendations";

-- DropTable
DROP TABLE "network_transfer_routes";

-- DropTable
DROP TABLE "operational_exception_indices";

-- DropTable
DROP TABLE "operational_exception_rcas";

-- DropTable
DROP TABLE "order_items";

-- DropTable
DROP TABLE "org_directors";

-- DropTable
DROP TABLE "org_documents";

-- DropTable
DROP TABLE "org_feature_flags";

-- DropTable
DROP TABLE "org_member_roles";

-- DropTable
DROP TABLE "org_members";

-- DropTable
DROP TABLE "org_quotas";

-- DropTable
DROP TABLE "organization_types";

-- DropTable
DROP TABLE "outside_medicine_receives";

-- DropTable
DROP TABLE "owner_delegations";

-- DropTable
DROP TABLE "owner_discount_cards";

-- DropTable
DROP TABLE "owner_overview_logs";

-- DropTable
DROP TABLE "owner_permission_scopes";

-- DropTable
DROP TABLE "owner_team_members";

-- DropTable
DROP TABLE "owner_teams";

-- DropTable
DROP TABLE "package_audit_logs";

-- DropTable
DROP TABLE "package_items";

-- DropTable
DROP TABLE "package_price_change_logs";

-- DropTable
DROP TABLE "package_price_rules";

-- DropTable
DROP TABLE "packaging_templates";

-- DropTable
DROP TABLE "partner_applications";

-- DropTable
DROP TABLE "permissions";

-- DropTable
DROP TABLE "pick_list_lines";

-- DropTable
DROP TABLE "pick_lists";

-- DropTable
DROP TABLE "pos_cart_lines";

-- DropTable
DROP TABLE "pos_carts";

-- DropTable
DROP TABLE "pos_credit_notes";

-- DropTable
DROP TABLE "prescription_items";

-- DropTable
DROP TABLE "prescriptions";

-- DropTable
DROP TABLE "price_approval_matrix_rows";

-- DropTable
DROP TABLE "price_change_approval_requests";

-- DropTable
DROP TABLE "price_resolution_snapshots";

-- DropTable
DROP TABLE "price_schedules";

-- DropTable
DROP TABLE "pricing_audit_logs";

-- DropTable
DROP TABLE "pricing_campaign_scopes";

-- DropTable
DROP TABLE "pricing_campaigns";

-- DropTable
DROP TABLE "pricing_emergency_overrides";

-- DropTable
DROP TABLE "procedure_orders";

-- DropTable
DROP TABLE "procurement_demand_lines";

-- DropTable
DROP TABLE "producer_approvals";

-- DropTable
DROP TABLE "producer_audit_logs";

-- DropTable
DROP TABLE "producer_email_recipients";

-- DropTable
DROP TABLE "producer_factories";

-- DropTable
DROP TABLE "producer_org_documents";

-- DropTable
DROP TABLE "producer_org_staff";

-- DropTable
DROP TABLE "producer_orgs";

-- DropTable
DROP TABLE "producer_staff_invite_deliveries";

-- DropTable
DROP TABLE "producer_staff_invites";

-- DropTable
DROP TABLE "product_change_requests";

-- DropTable
DROP TABLE "product_fingerprints";

-- DropTable
DROP TABLE "product_import_batches";

-- DropTable
DROP TABLE "product_import_rows";

-- DropTable
DROP TABLE "product_media";

-- DropTable
DROP TABLE "product_pricings";

-- DropTable
DROP TABLE "product_revisions";

-- DropTable
DROP TABLE "product_variants";

-- DropTable
DROP TABLE "product_versions";

-- DropTable
DROP TABLE "production_lines";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "proof_of_deliveries";

-- DropTable
DROP TABLE "purchase_order_lines";

-- DropTable
DROP TABLE "purchase_orders";

-- DropTable
DROP TABLE "purchase_requisition_lines";

-- DropTable
DROP TABLE "purchase_requisitions";

-- DropTable
DROP TABLE "putaway_tasks";

-- DropTable
DROP TABLE "qc_inspections";

-- DropTable
DROP TABLE "queue_events";

-- DropTable
DROP TABLE "queue_sessions";

-- DropTable
DROP TABLE "queue_tickets";

-- DropTable
DROP TABLE "quota_plans";

-- DropTable
DROP TABLE "quota_usages";

-- DropTable
DROP TABLE "recall_campaigns";

-- DropTable
DROP TABLE "replenishment_recommendations";

-- DropTable
DROP TABLE "retail_discount_approval_requests";

-- DropTable
DROP TABLE "retail_discount_rules";

-- DropTable
DROP TABLE "return_items";

-- DropTable
DROP TABLE "return_requests";

-- DropTable
DROP TABLE "reverse_logistics_cases";

-- DropTable
DROP TABLE "role_permissions";

-- DropTable
DROP TABLE "room_schedule_templates";

-- DropTable
DROP TABLE "scan_events";

-- DropTable
DROP TABLE "scenario_result_snapshots";

-- DropTable
DROP TABLE "scenario_runs";

-- DropTable
DROP TABLE "serial_ranges";

-- DropTable
DROP TABLE "serials";

-- DropTable
DROP TABLE "service_deliveries";

-- DropTable
DROP TABLE "service_level_objectives";

-- DropTable
DROP TABLE "service_media";

-- DropTable
DROP TABLE "service_pricing_change_logs";

-- DropTable
DROP TABLE "service_pricing_variants";

-- DropTable
DROP TABLE "service_proposals";

-- DropTable
DROP TABLE "settlement_adjustments";

-- DropTable
DROP TABLE "settlement_audit_logs";

-- DropTable
DROP TABLE "settlement_payments";

-- DropTable
DROP TABLE "slo_measurements";

-- DropTable
DROP TABLE "slot_locks";

-- DropTable
DROP TABLE "staff_invites";

-- DropTable
DROP TABLE "sterilization_cycle_items";

-- DropTable
DROP TABLE "sterilization_cycles";

-- DropTable
DROP TABLE "stock_adjustment_requests";

-- DropTable
DROP TABLE "stock_balances";

-- DropTable
DROP TABLE "stock_count_lines";

-- DropTable
DROP TABLE "stock_count_sessions";

-- DropTable
DROP TABLE "stock_discrepancies";

-- DropTable
DROP TABLE "stock_dispatch_discrepancies";

-- DropTable
DROP TABLE "stock_dispatch_items";

-- DropTable
DROP TABLE "stock_dispatches";

-- DropTable
DROP TABLE "stock_ledgers";

-- DropTable
DROP TABLE "stock_lot_balances";

-- DropTable
DROP TABLE "stock_lots";

-- DropTable
DROP TABLE "stock_request_items";

-- DropTable
DROP TABLE "stock_requests";

-- DropTable
DROP TABLE "stock_return_items";

-- DropTable
DROP TABLE "stock_returns";

-- DropTable
DROP TABLE "stock_transactions";

-- DropTable
DROP TABLE "stock_transfer_items";

-- DropTable
DROP TABLE "stock_transfers";

-- DropTable
DROP TABLE "super_admin_whitelist";

-- DropTable
DROP TABLE "support_tickets";

-- DropTable
DROP TABLE "surgery_case_checklists";

-- DropTable
DROP TABLE "surgery_case_staff";

-- DropTable
DROP TABLE "surgery_case_status_logs";

-- DropTable
DROP TABLE "surgery_package_consumptions";

-- DropTable
DROP TABLE "surgery_package_templates";

-- DropTable
DROP TABLE "team_invitations";

-- DropTable
DROP TABLE "template_category_items";

-- DropTable
DROP TABLE "ticket_attachments";

-- DropTable
DROP TABLE "ticket_audit_events";

-- DropTable
DROP TABLE "ticket_messages";

-- DropTable
DROP TABLE "treatment_course_doses";

-- DropTable
DROP TABLE "treatment_courses";

-- DropTable
DROP TABLE "treatment_day_items";

-- DropTable
DROP TABLE "treatment_days";

-- DropTable
DROP TABLE "treatment_revisions";

-- DropTable
DROP TABLE "units";

-- DropTable
DROP TABLE "user_contexts";

-- DropTable
DROP TABLE "user_country_roles";

-- DropTable
DROP TABLE "user_global_roles";

-- DropTable
DROP TABLE "user_medicine_risk_scores";

-- DropTable
DROP TABLE "user_state_roles";

-- DropTable
DROP TABLE "vaccine_inventory_mappings";

-- DropTable
DROP TABLE "vendor_attachments";

-- DropTable
DROP TABLE "vendor_contacts";

-- DropTable
DROP TABLE "vendor_ledger_entries";

-- DropTable
DROP TABLE "vendor_product_listings";

-- DropTable
DROP TABLE "vendor_receive_sessions";

-- DropTable
DROP TABLE "vendor_return_lines";

-- DropTable
DROP TABLE "vendor_returns";

-- DropTable
DROP TABLE "vet_countries";

-- DropTable
DROP TABLE "vet_regulatory_bodies";

-- DropTable
DROP TABLE "vet_required_doc_types";

-- DropTable
DROP TABLE "vial_instances";

-- DropTable
DROP TABLE "vial_return_controls";

-- DropTable
DROP TABLE "vial_returns";

-- DropTable
DROP TABLE "vial_session_events";

-- DropTable
DROP TABLE "vial_sessions";

-- DropTable
DROP TABLE "visit_attachments";

-- DropTable
DROP TABLE "vital_records";

-- DropTable
DROP TABLE "warehouse_audit_events";

-- DropTable
DROP TABLE "warehouse_staff_assignments";

-- DropTable
DROP TABLE "warehouse_transfer_order_lines";

-- DropTable
DROP TABLE "warehouse_transfer_orders";

-- DropTable
DROP TABLE "workspace_alerts";

-- DropTable
DROP TABLE "workspace_approval_requests";

-- DropTable
DROP TABLE "workspace_task_comments";

-- DropTable
DROP TABLE "workspace_tasks";

-- DropTable
DROP TABLE "write_off_request_lines";

-- DropTable
DROP TABLE "write_off_requests";

-- AddForeignKey
ALTER TABLE "campaign_bookings" ADD CONSTRAINT "campaign_bookings_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "campaign_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_bookings" ADD CONSTRAINT "campaign_bookings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "campaign_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
