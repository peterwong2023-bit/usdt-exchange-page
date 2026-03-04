#!/bin/bash

# Define the new navigation sections
LOGS_SECTION_NEW='                <div class="nav-section">
                    <div class="nav-section-title">日志</div>
                    <a href="mining-flow.html" class="nav-item">
                        <i class="fas fa-coins"></i>
                        <span>挖矿流水</span>
                    </a>
                    <a href="item-receipt.html" class="nav-item">
                        <i class="fas fa-gift"></i>
                        <span>物品领取</span>
                    </a>
                    <a href="platform-log.html" class="nav-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>平台日志</span>
                    </a>
                    <a href="audit-log.html" class="nav-item">
                        <i class="fas fa-clipboard-check"></i>
                        <span>审核日志</span>
                    </a>
                    <a href="operation-log.html" class="nav-item">
                        <i class="fas fa-history"></i>
                        <span>操作日志</span>
                    </a>
                </div>'

SYSTEM_SECTION_NEW='                <div class="nav-section">
                    <div class="nav-section-title">系统</div>
                    <a href="account-management.html" class="nav-item">
                        <i class="fas fa-users"></i>
                        <span>账号管理</span>
                    </a>
                    <a href="global-config.html" class="nav-item">
                        <i class="fas fa-globe"></i>
                        <span>全局配置</span>
                    </a>
                </div>'

# List of files to update
files=(
    "activity-center-admin/index.html"
    "activity-center-admin/dashboard.html"
    "activity-center-admin/mining-flow.html"
    "activity-center-admin/item-receipt.html"
    "activity-center-admin/platform-log.html"
    "activity-center-admin/audit-log.html"
    "activity-center-admin/operation-log.html"
    "activity-center-admin/claim-data.html"
    "activity-center-admin/user-behavior.html"
    "activity-center-admin/user-data.html"
    "activity-center-admin/user-detail.html"
    "activity-center-admin/account-management.html"
    "activity-center-admin/global-config.html"
    "activity-center-admin/merchant-list.html"
)

for file in "${files[@]}"; do
    echo "Updating $file..."
    
    # Extract current active item if any
    # This is a bit tricky with simple string replace, so we'll do it carefully
    
    # For simplicity and since we want consistency, we'll replace the sections and then fix active state if needed
    # But wait, I can just use sed to replace the whole block from "nav-section-title">日志 to the end of that section
    # and from "nav-section-title">系统 to the end of that section.
    
    # Actually, let's just use the current tool's StrReplace for each file to ensure we get it right.
    # The script approach might be risky with sed.
    
    # I will do it manually via tool calls for each file to be 100% sure.
done
