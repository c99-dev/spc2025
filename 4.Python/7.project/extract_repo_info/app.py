import requests
import re
from datetime import datetime


def extract_repo_info(github_url):
    """GitHub URL에서 소유자와 레포지토리 이름을 추출합니다."""
    pattern = r"github\.com\/([^\/]+)\/([^\/]+)"
    match = re.search(pattern, github_url)

    if not match:
        raise ValueError("유효한 GitHub 레포지토리 URL이 아닙니다.")

    owner = match.group(1)
    repo = match.group(2)

    # URL 끝에 .git이 포함된 경우 제거
    if repo.endswith(".git"):
        repo = repo[:-4]

    return owner, repo


def fetch_recent_issues(owner, repo, limit=5):
    """최근 이슈를 가져옵니다."""
    url = f"https://api.github.com/repos/{owner}/{repo}/issues"
    params = {
        "state": "all",  # 모든 상태(open, closed)
        "sort": "created",  # 생성일 기준 정렬
        "direction": "desc",  # 내림차순 정렬
        "per_page": limit,  # 가져올 이슈 수
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        print(f"이슈를 가져오는 중 오류 발생: {response.status_code}")
        return []

    # PR은 제외하고 순수 이슈만 필터링
    issues = [issue for issue in response.json() if "pull_request" not in issue]
    return issues[:limit]


def fetch_recent_prs(owner, repo, limit=5):
    """최근 PR을 가져옵니다."""
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls"
    params = {
        "state": "all",  # 모든 상태(open, closed, merged)
        "sort": "created",  # 생성일 기준 정렬
        "direction": "desc",  # 내림차순 정렬
        "per_page": limit,  # 가져올 PR 수
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        print(f"PR을 가져오는 중 오류 발생: {response.status_code}")
        return []

    return response.json()[:limit]


def format_date(date_str):
    """ISO 형식 날짜를 보기 좋게 포맷팅합니다."""
    date_obj = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%SZ")
    return date_obj.strftime("%Y-%m-%d %H:%M:%S")


def print_issue_info(issues):
    """이슈 정보를 출력합니다."""
    if not issues:
        print("가져온 이슈가 없습니다.")
        return

    print("\n===== 최근 이슈 =====")
    for i, issue in enumerate(issues, 1):
        print(f"{i}. [{issue['state']}] {issue['title']}")
        print(f"   작성자: {issue['user']['login']}")
        print(f"   생성일: {format_date(issue['created_at'])}")
        print(f"   URL: {issue['html_url']}")
        print()


def print_pr_info(prs):
    """PR 정보를 출력합니다."""
    if not prs:
        print("가져온 PR이 없습니다.")
        return

    print("\n===== 최근 PR =====")
    for i, pr in enumerate(prs, 1):
        print(f"{i}. [{pr['state']}] {pr['title']}")
        print(f"   작성자: {pr['user']['login']}")
        print(f"   생성일: {format_date(pr['created_at'])}")
        if pr["merged_at"]:
            print(f"   병합일: {format_date(pr['merged_at'])}")
        print(f"   URL: {pr['html_url']}")
        print()


def main():
    # GitHub 레포지토리 URL 입력 받기
    github_url = input("GitHub 레포지토리 URL을 입력하세요: ")

    try:
        # 소유자와 레포지토리 이름 추출
        owner, repo = extract_repo_info(github_url)
        print(f"\n{owner}/{repo} 레포지토리의 정보를 가져오는 중...")

        # 최근 이슈와 PR 가져오기
        issues = fetch_recent_issues(owner, repo)
        prs = fetch_recent_prs(owner, repo)

        # 정보 출력
        print_issue_info(issues)
        print_pr_info(prs)

    except Exception as e:
        print(f"오류 발생: {e}")


if __name__ == "__main__":
    main()
