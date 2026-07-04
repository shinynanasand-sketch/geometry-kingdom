#!/usr/bin/env python3
"""
Automated Test Script (Python)
자동 테스트 스크립트 - 정적 분석 및 구문 검증

실행: python test-automation.py
"""

import os
import json
import sys

# 색상 코드
class Colors:
    RESET = '\033[0m'
    GREEN = '\033[32m'
    RED = '\033[31m'
    YELLOW = '\033[33m'
    BLUE = '\033[34m'
    CYAN = '\033[36m'

# 테스트 결과
test_results = {
    'total': 0,
    'passed': 0,
    'failed': 0,
    'errors': []
}

def print_header(text):
    """헤더 출력"""
    print(f"\n{Colors.BLUE}[{text}]{Colors.RESET}")

def test_file_exists(file_path):
    """파일 존재 확인"""
    test_results['total'] += 1
    if os.path.exists(file_path):
        print(f"{Colors.GREEN}✓{Colors.RESET} {file_path}")
        test_results['passed'] += 1
        return True
    else:
        print(f"{Colors.RED}✗{Colors.RESET} {file_path} - 파일 없음")
        test_results['failed'] += 1
        test_results['errors'].append(f"파일 없음: {file_path}")
        return False

def test_json_valid(file_path):
    """JSON 유효성 검증"""
    test_results['total'] += 1
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"{Colors.GREEN}✓{Colors.RESET} {file_path} - 유효한 JSON")
        test_results['passed'] += 1
        return True
    except Exception as e:
        print(f"{Colors.RED}✗{Colors.RESET} {file_path} - JSON 파싱 오류: {str(e)}")
        test_results['failed'] += 1
        test_results['errors'].append(f"JSON 오류 ({file_path}): {str(e)}")
        return False

def test_js_syntax(file_path):
    """JavaScript 구문 검증 (간단한 괄호 매칭)"""
    test_results['total'] += 1
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 괄호 매칭 체크
        open_braces = content.count('{')
        close_braces = content.count('}')
        open_parens = content.count('(')
        close_parens = content.count(')')
        
        if open_braces != close_braces:
            raise Exception(f"중괄호 불일치: {{ {open_braces}개, }} {close_braces}개")
        if open_parens != close_parens:
            raise Exception(f"소괄호 불일치: ( {open_parens}개, ) {close_parens}개")
        
        print(f"{Colors.GREEN}✓{Colors.RESET} {file_path} - 구문 정상")
        test_results['passed'] += 1
        return True
    except Exception as e:
        print(f"{Colors.RED}✗{Colors.RESET} {file_path} - {str(e)}")
        test_results['failed'] += 1
        test_results['errors'].append(f"구문 오류 ({file_path}): {str(e)}")
        return False

def test_class_defined(file_path, class_name):
    """클래스 정의 확인"""
    test_results['total'] += 1
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if f"class {class_name}" in content:
            print(f"{Colors.GREEN}✓{Colors.RESET} {class_name} 클래스 정의됨 ({file_path})")
            test_results['passed'] += 1
            return True
        else:
            raise Exception(f"{class_name} 클래스 정의 없음")
    except Exception as e:
        print(f"{Colors.RED}✗{Colors.RESET} {file_path} - {str(e)}")
        test_results['failed'] += 1
        test_results['errors'].append(f"클래스 정의 오류 ({file_path}): {str(e)}")
        return False

def test_html_structure(file_path):
    """HTML 기본 구조 검증"""
    test_results['total'] += 1
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        required_tags = ['<!DOCTYPE html>', '<html', '<head>', '<body>']
        for tag in required_tags:
            if tag not in content:
                raise Exception(f"{tag} 태그 없음")
        
        print(f"{Colors.GREEN}✓{Colors.RESET} {file_path} - HTML 구조 정상")
        test_results['passed'] += 1
        return True
    except Exception as e:
        print(f"{Colors.RED}✗{Colors.RESET} {file_path} - {str(e)}")
        test_results['failed'] += 1
        test_results['errors'].append(f"HTML 구조 오류 ({file_path}): {str(e)}")
        return False

# 테스트 시작
print(f"{Colors.CYAN}========================================{Colors.RESET}")
print(f"{Colors.CYAN}   자동 테스트 시작{Colors.RESET}")
print(f"{Colors.CYAN}========================================{Colors.RESET}")

# 1. 파일 존재 확인
print_header("1. 파일 존재 확인 테스트")

required_files = [
    # HTML
    'index.html', 'ar-marker.html', 'ar-markerless.html',
    'quiz.html', 'progress.html', 'shop.html',
    'collection.html', 'minigames.html', 'juryeonggu.html',
    # CSS
    'css/style.css', 'css/ar-ui.css',
    # JavaScript
    'js/app.js', 'js/utils.js', 'js/progress-tracker.js',
    'js/geometry-shapes.js', 'js/ar-marker.js',
    'js/ar-markerless.js', 'js/shape-builder.js',
    # Data
    'data/levels.json',
    # Docs
    'docs/PRD.md', 'docs/SRS.md', 'docs/TRD.md', 'docs/TEST_REPORT.md'
]

for file in required_files:
    test_file_exists(file)

# 2. JSON 유효성 검증
print_header("2. JSON 유효성 검증")
test_json_valid('data/levels.json')

# 3. JavaScript 구문 검증
print_header("3. JavaScript 구문 검증")

js_files = [
    'js/app.js', 'js/utils.js', 'js/progress-tracker.js',
    'js/geometry-shapes.js', 'js/ar-marker.js',
    'js/ar-markerless.js', 'js/shape-builder.js'
]

for js_file in js_files:
    if os.path.exists(js_file):
        test_js_syntax(js_file)

# 4. 클래스 정의 확인
print_header("4. 클래스/함수 정의 확인")

class_checks = [
    ('js/geometry-shapes.js', 'GeometryShapes'),
    ('js/ar-marker.js', 'ARMarkerController'),
    ('js/ar-markerless.js', 'ARMarkerlessController'),
    ('js/shape-builder.js', 'ShapeBuilder')
]

for file_path, class_name in class_checks:
    if os.path.exists(file_path):
        test_class_defined(file_path, class_name)

# 5. levels.json 데이터 구조 검증
print_header("5. levels.json 데이터 구조 검증")

test_results['total'] += 1
try:
    with open('data/levels.json', 'r', encoding='utf-8') as f:
        levels_data = json.load(f)
    
    if 'levels' not in levels_data or not isinstance(levels_data['levels'], list):
        raise Exception('levels 배열이 없습니다')
    
    if len(levels_data['levels']) != 7:
        raise Exception(f"레벨 개수 오류: {len(levels_data['levels'])}개 (예상: 7개)")
    
    required_fields = ['id', 'name', 'difficulty', 'description', 'shapes']
    for i, level in enumerate(levels_data['levels']):
        for field in required_fields:
            if field not in level:
                raise Exception(f"레벨 {i+1}: {field} 필드 없음")
    
    print(f"{Colors.GREEN}✓{Colors.RESET} levels.json 데이터 구조 정상 (7개 레벨)")
    test_results['passed'] += 1
except Exception as e:
    print(f"{Colors.RED}✗{Colors.RESET} levels.json - {str(e)}")
    test_results['failed'] += 1
    test_results['errors'].append(f"데이터 구조 오류: {str(e)}")

# 6. HTML 기본 구조 검증
print_header("6. HTML 기본 구조 검증")

html_files = ['index.html', 'ar-marker.html', 'ar-markerless.html']
for html_file in html_files:
    if os.path.exists(html_file):
        test_html_structure(html_file)

# 7. A-Frame 및 AR.js 스크립트 확인
print_header("7. A-Frame 및 AR.js 스크립트 확인")

ar_files = ['ar-marker.html', 'ar-markerless.html']
for ar_file in ar_files:
    test_results['total'] += 1
    try:
        with open(ar_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'aframe.io' not in content and 'aframe.min.js' not in content:
            raise Exception('A-Frame 스크립트 로드 없음')
        if 'AR.js' not in content and 'aframe-ar' not in content:
            raise Exception('AR.js 스크립트 로드 없음')
        
        print(f"{Colors.GREEN}✓{Colors.RESET} {ar_file} - A-Frame/AR.js 로드 확인")
        test_results['passed'] += 1
    except Exception as e:
        print(f"{Colors.RED}✗{Colors.RESET} {ar_file} - {str(e)}")
        test_results['failed'] += 1
        test_results['errors'].append(f"스크립트 로드 오류 ({ar_file}): {str(e)}")

# 테스트 결과 요약
print(f"\n{Colors.CYAN}========================================{Colors.RESET}")
print(f"{Colors.CYAN}   테스트 결과 요약{Colors.RESET}")
print(f"{Colors.CYAN}========================================{Colors.RESET}\n")

print(f"총 테스트: {test_results['total']}개")
print(f"{Colors.GREEN}통과: {test_results['passed']}개 ({round(test_results['passed'] / test_results['total'] * 100)}%){Colors.RESET}")
print(f"{Colors.RED}실패: {test_results['failed']}개 ({round(test_results['failed'] / test_results['total'] * 100)}%){Colors.RESET}")

if test_results['failed'] > 0:
    print(f"\n{Colors.RED}발견된 오류:{Colors.RESET}")
    for i, error in enumerate(test_results['errors'], 1):
        print(f"  {i}. {error}")

print()

# 종료 코드
if test_results['failed'] == 0:
    print(f"{Colors.GREEN}✓ 모든 테스트 통과!{Colors.RESET}\n")
    sys.exit(0)
else:
    print(f"{Colors.RED}✗ 일부 테스트 실패{Colors.RESET}\n")
    sys.exit(1)
