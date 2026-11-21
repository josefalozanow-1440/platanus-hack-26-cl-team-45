"""Code rules adopted from revi-mono ADRs, checked by reading the source."""

import ast
from pathlib import Path

APP = Path(__file__).parent.parent / "app"


def _modules(folder: Path = APP) -> list[tuple[Path, ast.Module]]:
    return [(path, ast.parse(path.read_text())) for path in folder.rglob("*.py")]


def _imported_names(tree: ast.Module) -> set[str]:
    names = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            names.update(alias.name.split(".")[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            names.add(node.module.split(".")[0])
    return names


def test_services_never_import_http() -> None:
    """ADR-0011: services raise domain errors; only routers speak HTTP."""
    offenders = [
        path.name for path, tree in _modules(APP / "services") if _imported_names(tree) & {"fastapi", "starlette"}
    ]
    assert offenders == []


def test_env_vars_are_read_only_in_config() -> None:
    """ADR-0015: environment variables are read only in app/config.py."""
    offenders = [
        path.name
        for path, tree in _modules()
        if path.name != "config.py"
        and any(isinstance(n, ast.Attribute) and n.attr in {"environ", "getenv"} for n in ast.walk(tree))
    ]
    assert offenders == []


def test_no_nested_functions() -> None:
    """ADR-0013: a function is never defined inside another one."""
    function_types = (ast.FunctionDef, ast.AsyncFunctionDef)
    offenders = [
        f"{path.name}:{inner.lineno}"
        for path, tree in _modules()
        for outer in ast.walk(tree)
        if isinstance(outer, function_types)
        for inner in ast.walk(outer)
        if inner is not outer and isinstance(inner, function_types)
    ]
    assert offenders == []


def test_no_raw_dict_returns() -> None:
    """ADR-0014: return a Pydantic model, dataclass or TypedDict, never a bare dict."""
    offenders = [
        f"{path.name}:{node.lineno}"
        for path, tree in _modules()
        for node in ast.walk(tree)
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
        and node.returns is not None
        and ast.unparse(node.returns).split("[")[0] in {"dict", "Dict"}
    ]
    assert offenders == []
